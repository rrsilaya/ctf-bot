import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from 'typeorm';
import { DefaultEntity } from '@decorators';
import { User } from './user';

@Entity()
export class Challenge extends DefaultEntity {
    @Column()
    flag: string;

    @Column()
    level: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @ManyToOne(type => User, user => user.authoredChallenges)
    author: User;

    @ManyToMany(type => User, { eager: true })
    @JoinTable()
    solvers: User[];

    public static getBasePoint(level: number): number {
        const points = [100, 80, 50, 20, 10];
        return points[level - 1];
    }
}
