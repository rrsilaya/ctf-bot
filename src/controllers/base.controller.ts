import { Message } from 'discord.js';
import { BotError, ErrorCode } from '../errors';

export class BaseController {
    getArgs = (message: Message, params: ReadonlyArray<string>): any => {
        const [, ...args] = Array.from(message.content.match(/(?:[^\s"]+|"[^"]*")+/g));

        if (args.length !== params.length) {
            const error = `<@${message.author.id}> Invalid argument count: received ${args.length}`;

            message.channel.send(error);
            throw new BotError(ErrorCode.INVALID_ARGUMENT_COUNT, error);
        }

        return args.reduce((mapping, arg, i) => ({
            ...mapping,
            [params[i]]: arg.replace(/"/g, ''),
        }), {});
    }

    parseChallengeId = (message: Message, challengeId: string): number => {
        const regex = /0x([0-9a-f]{4})/;

        if (!regex.test(challengeId)) {
            const error = `<@${message.author.id}> Invalid challenge id: ${challengeId}`;

            message.channel.send(error);
            throw new BotError(ErrorCode.INVALID_ARGUMENT_COUNT, error);
        }

        const [, id] = challengeId.match(regex);
        return parseInt(id, 16);
    }

    parseFlag = (message: Message, flag: string): string => {
        const regex = /^\|?\|?(flag\{[A-Za-z0-9_]+\})\|?\|?$/;

        if (!regex.test(flag)) {
            const error = 'Invalid flag format.';

            message.channel.send(error);
            throw new BotError(ErrorCode.INVALID_INPUT, error);
        }

        const [, parsedFlag] = flag.match(regex);
        return parsedFlag;
    }
}
