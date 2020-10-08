import { Answer, Challenge, User, Server } from '@models';
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

    static submit = async (challenge: Challenge, flag: string, user: User): Promise<Answer> => {
        const answered = await Answer.findOne({
            where: {
                user: { id: user.id },
                challenge: { id: challenge.id },
            },
        });
        if (answered) {
            throw new BotError(ErrorCode.CHALLENGE_ALREADY_SOLVED, `<@${user.userId}> You already answered this challenge.`);
        }

        if (challenge.flag !== flag) {
            throw new BotError(ErrorCode.INCORRECT_FLAG, `<@${user.userId}> You submitted an incorrect flag.`);
        }

        const solvers = challenge.answers.length;
        const basePoint = challenge.getBasePoint();
        const score = ChallengeHandler.getScore(solvers, basePoint);

        const answer = new Answer();
        Object.assign(answer, { score, user, challenge });
        await answer.save();

        challenge.answers.push(answer);
        await challenge.save();

        return answer;
    }

    static list = async (user: User, server: Server): Promise<any> => {
        const result = await Challenge.createQueryBuilder('challenge')
            .select('challenge')
            .addSelect('NOT ISNULL(answer.id)', 'solved')
            .leftJoin(
                'challenge.answers',
                'answer',
                'answer.userId = :userId',
                { userId: user.id }
            )
            .where('challenge.serverId = :serverId', { serverId: server.id })
            .andWhere('challenge.flag IS NOT NULL')
            .orderBy('challenge.id')
            .getRawMany();

        return result.map(row => ({
            id: row.challenge_id,
            title: row.challenge_title,
            level: row.challenge_level,
            solved: !!(+row.solved),
        }));
    }

    static getScore = (solvers: number, basePoint: number): number => {
        /**
         * Scoring logic:
         * 1st and 2nd: 100% score
         * 3rd to 6th: 90% score
         * 7th to 15th: 80% score
         * 16th and beyod: 70% score
         */
        const tiers = [2, 6, 15, Infinity];
        const multipliers = [1, 0.9, 0.8, 0.7];

        const solverTier = tiers.findIndex(tier => solvers < tier);
        return Math.floor(multipliers[solverTier] * basePoint);
    }
}
