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

    public static getBasePoint(level: number): number {
        const points = [100, 80, 50, 25, 10];
        return points[level - 1];
    }
}
