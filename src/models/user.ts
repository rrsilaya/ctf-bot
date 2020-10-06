import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { DefaultEntity } from '@decorators';
import { Challenge } from './challenge';
import { Server } from './server';

@Entity()
export class User extends DefaultEntity {
    @Column()
    userId: string;

    @ManyToOne(type => Server, server => server.users)
    server: Server;

    @OneToMany(type => Challenge, challenge => challenge.author)
    authoredChallenges: Challenge[];
}
