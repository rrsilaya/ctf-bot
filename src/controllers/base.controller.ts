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
            [params[i]]: arg,
        }), {});
    }
}
