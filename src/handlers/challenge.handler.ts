import { Challenge, User, Server } from '@models';
import { BotError, ErrorCode } from '../errors';

export class ChallengeHandler {
    static readonly FLAG_REGEX = /^flag\{[A-Za-z0-9]+\}$/;

    static create = async (
        level: number,
        title: string,
        description: string,
        author: User,
        server: Server
    ): Promise<Challenge> => {
        const challenge = new Challenge();

        Object.assign(challenge, {
            level,
            title,
            description,
            author,
            server,
        });

        await challenge.validate();
        await challenge.save();

        return challenge;
    }

    static setFlag = async (challenge: Challenge, flag: string): Promise<Challenge> => {
        if (!ChallengeHandler.FLAG_REGEX.test(flag)) {
            throw new BotError(ErrorCode.INVALID_INPUT, 'Invalid flag format.');
        }

        challenge.flag = flag;
        await challenge.save();

        return challenge;
    }
}
