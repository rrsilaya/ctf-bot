import { Message, TextChannel } from 'discord.js';
import { Server, User } from '@models';
import { mention } from '@utils/discord';
import { BotError, ErrorCode } from '../errors';

export interface ControllerArgs {
    readonly server?: Server;
    readonly user?: User;
    message: Message;
}

export class BaseController {
    protected server: Server;
    protected user: User;
    protected message: Message;

    protected announcement: TextChannel;
    protected challengeList: Message;
    protected leaderboard: Message;

    constructor(settings: ControllerArgs) {
        this.user = settings.user;
        this.message = settings.message;

        if (settings.server) {
            this.setServer(settings.server);
        }
    }

    setServer = (server: Server) => {
        this.server = server;
        this.announcement = this.message
            .guild
            .channels
            .cache
            .get(this.server.channelId) as TextChannel;
    }

    getArgs = (params: ReadonlyArray<string>): any => {
        const { content } = this.message;
        const [, ...args] = Array.from(content.match(/(?:[^\s"]+|"[^"]*")+/g));

        if (args.length !== params.length) {
            const error = `Invalid argument count: received ${args.length}`;

            this.messageAuthor(error);
            throw new BotError(ErrorCode.INVALID_ARGUMENT_COUNT, error);
        }

        return args.reduce((mapping, arg, i) => ({
            ...mapping,
            [params[i]]: arg.replace(/"/g, ''),
        }), {});
    }

    parseChallengeId = (challengeId: string): number => {
        const regex = /0x([0-9a-f]{4})/;

        if (!regex.test(challengeId)) {
            const error = `Invalid challenge id: ${challengeId}`;

            this.messageAuthor(error);
            throw new BotError(ErrorCode.INVALID_ARGUMENT_COUNT, error);
        }

        const [, id] = challengeId.match(regex);
        return parseInt(id, 16);
    }

    parseFlag = (flag: string): string => {
        const regex = /^\|?\|?(flag\{[A-Za-z0-9_]+\})\|?\|?$/;

        if (!regex.test(flag)) {
            const error = 'Invalid flag format.';

            this.messageAuthor(error);
            throw new BotError(ErrorCode.INVALID_INPUT, error);
        }

        const [, parsedFlag] = flag.match(regex);
        return parsedFlag;
    }

    messageAuthor = (message: string): void => {
        const { author, channel } = this.message;

        channel.send(`${mention(author)} ${message}`);
    }

    loadAnnouncement = async (): Promise<void> => {
        if (!this.announcement) return;

        const pinned = await this.announcement.messages.fetchPinned();

        this.challengeList = pinned.find(message => message.embeds[0].title === 'List of CTF Challenges');
        this.leaderboard = pinned.find(message => message.embeds[0].title === 'Leaderboard');
    }
}
