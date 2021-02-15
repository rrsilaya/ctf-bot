import { Message, TextChannel } from 'discord.js';
import { Server, User } from '@models';
import { Dictionary } from '@models/types';
import { createEmbed, regex as pattern, toHex } from '@utils';
import { mention } from '@utils/discord';
import { BotError, ErrorCode } from '../errors';

export interface ControllerArgs {
    readonly server?: Server;
    readonly user?: User;
    message: Message;
}

export abstract class BaseController {
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

    getArgs = (params: ReadonlyArray<string>, validateLength = true): Dictionary<any> => {
        const { content } = this.message;
        const [, ...args] = Array.from(content.match(/(?:[^\s"]+|"[^"]*")+/g));

        if (validateLength && args.length !== params.length) {
            const error = `Invalid argument count: received ${args.length}`;

            this.messageAuthor(error);
            throw new BotError(ErrorCode.INVALID_ARGUMENT_COUNT, error);
        }

        return args.reduce((mapping, arg, i) => ({
            ...mapping,
            [params[i]]: arg.replace(/"/g, ''),
        }), {
            // Array of args
            _args: args,
        });
    }

    parseChallengeId = (challengeId: string): number => {
        if (!pattern.CHALLENGE_ID.test(challengeId)) {
            const error = `Invalid challenge id: ${challengeId}`;

            this.messageAuthor(error);
            throw new BotError(ErrorCode.INVALID_ARGUMENT_COUNT, error);
        }

        const [, id] = challengeId.match(pattern.CHALLENGE_ID);
        return parseInt(id, 16);
    }

    parseFlag = (flag: string): string => {
        if (!pattern.FLAG.test(flag)) {
            const error = 'Invalid flag format.';

            this.messageAuthor(error);
            throw new BotError(ErrorCode.INVALID_INPUT, error);
        }

        const [, parsedFlag] = flag.match(pattern.FLAG);
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

    announce = async ({ leaderboard = [], challenges = [] }, isInitial = false): Promise<void> => {
        // Send Leaderboard
        if (leaderboard.length || isInitial) {
            const ranking = leaderboard.reduce((ranking, user, rank) => (
                `${ranking}${rank + 1}. <@${user.userId}> (${user.score} pts.)\n`
            ), '');

            const leaderboardEmbed = createEmbed()
                .setTitle('Leaderboard')
                .setDescription(ranking || 'No data for leaderboard yet.');

            if (this.leaderboard) {
                this.leaderboard.edit(leaderboardEmbed);
            } else {
                const message = await this.announcement.send(leaderboardEmbed);
                message.pin();
            }
        }

        // Send Challenges
        if (challenges.length || isInitial) {
            const list = challenges.reduce(
                (list, challenge) => `${list}${toHex(challenge.id)}: ${challenge.title} (Level ${challenge.level})\n`,
                ''
            );
            const challengeEmbed = createEmbed()
                .setTitle('List of CTF Challenges')
                .setDescription(list || 'No challenges yet. Please add one to start the fun!');

            if (this.challengeList) {
                this.challengeList.edit(challengeEmbed);
            } else {
                const message = await this.announcement.send(challengeEmbed);
                message.pin();
            }
        }
    }

    error = (): void => {
        const { channel, author } = this.message;
        channel.send(`${mention(author)} I wasn't able to recognize what you wanted to do.`);
    };
}
