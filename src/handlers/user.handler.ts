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

    // static getLeaderboard = async (server: Server): Promise<User> => {
    //     const user = await User.createQueryBuilder('user')
    //         .select('user')
    //         .innerJoinAndSelect(
    //             'user.servers',
    //             'server',
    //             'server.id = :serverId',
    //             { serverId: server.id }
    //         )
    // }
}
