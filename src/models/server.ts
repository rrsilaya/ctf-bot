import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { DefaultEntity } from '@decorators';
import { Challenge } from './challenge';
import { User } from './user';

@Entity()
export class Server extends DefaultEntity {
    @Column()
    guildId: string;

    @Column()
    channelId: string;

    @OneToMany(type => Challenge, challenge => challenge.server)
    challenges: Challenge[];

    @ManyToMany(type => User, user => user.servers, { cascade: true })
    @JoinTable()
    users: User[];
}
