import {
    Column,
    Entity,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { DefaultEntity } from '@decorators';
import { Answer } from './answer';
import { Challenge } from './challenge';
import { Server } from './server';

@Entity()
export class User extends DefaultEntity {
    @Column()
    userId: string;

    @OneToMany(type => Challenge, challenge => challenge.author)
    authoredChallenges: Challenge[];

    @ManyToMany(type => Server, server => server.users)
    servers: Server[];

    @OneToMany(type => Answer, answer => answer.user)
    answers: Answer[];

    static async registerOrFindOne(userId: string, server: Server): Promise<User> {
        let user = await this.createQueryBuilder('user')
            .select('user')
            .leftJoinAndSelect(
                'user.servers',
                'server',
                'server.guildId = :guildId',
                { guildId: server.guildId }
            )
            .where('user.userId = :userId', { userId })
            .getOne();

        // User is not yet registered at all
        if (!user) {
            user = new User();
            user.userId = userId;
            user.servers = [];
        }

        // User is not yet registered to the server/guild
        if (!user.servers.length) {
            user.servers.push(server);
            await user.save();
        }

        return user;
    }
}
