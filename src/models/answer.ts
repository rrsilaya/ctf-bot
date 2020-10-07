import {
    Column,
    Entity,
    ManyToOne,
} from 'typeorm';
import { DefaultEntity } from '@decorators';
import { Challenge } from './challenge';
import { User } from './user';

@Entity()
export class Answer extends DefaultEntity {
    @Column()
    score: number;

    @ManyToOne(type => User, user => user.answers)
    user: User;

    @ManyToOne(type => Challenge, challenge => challenge.answers)
    challenge: Challenge;
}
