import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Min, Max } from 'class-validator';
import { DefaultEntity } from '@decorators';
import { Answer } from './answer';
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

    @OneToMany(type => Answer, answer => answer.challenge)
    answers: Answer[];

    getBasePoint(): number {
        const points = [10, 25, 50, 80, 100];
        return points[this.level - 1];
    }

    static async getByGuild(challengeId: number, guildId: string): Promise<Challenge> {
        const challenge = await Challenge.createQueryBuilder('challenge')
            .select('challenge')
            .innerJoinAndSelect(
                'challenge.server',
                'server',
                'server.guildId = :guildId',
                { guildId }
            )
            .leftJoinAndSelect('challenge.author', 'author')
            .leftJoinAndSelect('challenge.answers', 'answers')
            .where('challenge.id = :challengeId', { challengeId })
            .getOne();

        return challenge;
    }
}
