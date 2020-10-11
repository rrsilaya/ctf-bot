import { Server, User } from '@models';

export class UserHandler {
    static register = async (userId: string, server: Server): Promise<User> => {
        let user = await User.findOne({ userId });

        if (!user) {
            user = new User();
            user.servers = [];
        }

        Object.assign(user, {
            userId,
            servers: user.servers.push(server),
        });

        await user.save();
        return user;
    }

    static getLeaderboard = async (server: Server): Promise<Array<any>> => {
        const users = await User.createQueryBuilder('user')
            .select('user')
            .addSelect('SUM(answer.score)', 'score')
            .innerJoin('user.answers', 'answer')
            .innerJoin(
                'answer.challenge',
                'challenge',
                'answer.challengeId = challenge.id AND challenge.serverId = :serverId',
                { serverId: server.id }
            )
            .orderBy('score', 'DESC')
            .groupBy('user.id')
            .limit(15)
            .getRawMany();

        return users.map(user => ({
            userId: user.user_userId,
            score: +user.score,
        }));
    }
}
