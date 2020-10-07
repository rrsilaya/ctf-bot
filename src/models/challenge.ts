import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from 'typeorm';
import { Min, Max } from 'class-validator';
import { DefaultEntity } from '@decorators';
import { Server } from './server';
import { User } from './user';

@Entity()
export class Challenge extends DefaultEntity {
    @Column({ nullable: true })
    flag: string;

    @Column()
    @Min(1)
    @Max(5)
    level: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @ManyToOne(type => User, user => user.authoredChallenges)
    author: User;

    @ManyToOne(type => Server, server => server.challenges)
    server: Server;

    @ManyToMany(type => User, { eager: true })
    @JoinTable()
    solvers: User[];

    getBasePoint(): number {
        const points = [10, 25, 50, 80, 100];
        return points[this.level - 1];
    }
}
