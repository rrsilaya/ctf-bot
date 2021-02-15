import { Message, TextChannel } from 'discord.js';
import { ChallengeHandler, UserHandler } from '@handlers';
import {
    Challenge,
    Server,
    User,
} from '@models';
import { createEmbed, toHex } from '@utils';
import { BaseController } from './base.controller';

export class ChallengeController extends BaseController {
    create = async (): Promise<void> => {
        const args = this.getArgs([
            'level',
            'title',
            'description',
        ]);

        const author = await User.registerOrFindOne(this.message.author.id, this.server);

        try {
            const challenge = await ChallengeHandler.create(
                +args.level,
                args.title,
                args.description,
                author,
                this.server,
            );

            const ctfId = toHex(challenge.id);
            this.message.channel.send(`CTF ${ctfId}: ${args.title} created by <@${author.userId}>. Please set the flag to start the challenge.`);
        } catch (error) {
            this.message.channel.send(`Unable to create challenge: ${error.message}`);
        }
    }

    setFlag = async (): Promise<void> => {
        this.message.delete(); // Make sure to delete flag

        const args = this.getArgs(['id', 'flag']);
        const challengeId = this.parseChallengeId(args.id);

        const flag = this.parseFlag(args.flag);
        const challenge = await Challenge.getByGuild(challengeId, this.message.guild.id);

        const authorId = this.message.author.id;

        if (!challenge) {
            this.message.channel.send(`<@${authorId}> Challenge ${args.id} does not exist.`);
            return;
        }

        if (challenge.author?.userId !== authorId) {
            this.message.channel.send(`<@${authorId}> You don't have permission to set the flag.`);
            return;
        }

        let shouldNotifyEveryone = true;
        if (challenge.flag) shouldNotifyEveryone = false; // do not notify when only editing flag

        try {
            await ChallengeHandler.setFlag(challenge, flag);
            this.message.channel.send(`<@${authorId}> Successfully set flag to challenge ${args.id}`);

            if (shouldNotifyEveryone) {
                const embed = createEmbed()
                    .setAuthor(this.message.author.username, this.message.author.avatarURL())
                    .setTitle(`${args.id}: ${challenge.title}`)
                    .setDescription(challenge.description)
                    .addField('Difficulty', `Level ${challenge.level}`);

                this.message.channel.send(`A new CTF challenge has been created by <@${authorId}>!`);
                this.message.channel.send(embed);

                this.updateChallengeList();
            }
        } catch (error) {
            this.message.channel.send(`Unable to set the flag: ${error.message}`);
        }
    }

    updateChallengeList = async (): Promise<void> => {
        const challenges = await ChallengeHandler.list(this.server);

        await this.loadAnnouncement();
        this.announce({ challenges });
    }

    submit = async (): Promise<void> => {
        this.message.delete(); // delete flag immediately

        const args = this.getArgs(['id', 'flag']);
        const challengeId = this.parseChallengeId(args.id);

        const flag = this.parseFlag(args.flag);
        const user = await User.registerOrFindOne(this.message.author.id, this.server);

        const challenge = await Challenge.getByGuild(challengeId, this.message.guild.id);
        if (!challenge) {
            this.message.channel.send(`<@${user.userId}> Challenge ${args.id} does not exist.`);
            return;
        }

        if (challenge.author.id === user.id) {
            this.message.channel.send(`<@${user.userId}> You cannot answer your submitted challenge.`);
            return;
        }

        try {
            const answer = await ChallengeHandler.submit(challenge, flag, user);
            const embed = createEmbed()
                .setTitle(`A user has captured the flag for challenge ${args.id}`)
                .setDescription(`<@${user.userId}> has captured the flag for challenge ${args.id} and gained ${answer.score} points!`)
                .setTimestamp();

            this.message.channel.send(embed);
            this.updateLeaderboard();
        } catch (error) {
            this.message.channel.send(error.message);
        }
    }

    updateLeaderboard = async (): Promise<void> => {
        const leaderboard = await UserHandler.getLeaderboard(this.server);

        await this.loadAnnouncement();
        this.announce({ leaderboard });
    }

    list = async (): Promise<void> => {
        const user = await User.registerOrFindOne(this.message.author.id, this.server);
        const challenges = await ChallengeHandler.list(this.server, user);

        if (!challenges) {
            this.message.channel.send('No CTF challenges yet.');
            return;
        }

        const list = challenges.reduce(
            (list, challenge) => `${list}${toHex(challenge.id)}: ${challenge.title} (Level ${challenge.level}) ${challenge.solved ? '✅' : ''}\n`,
            ''
        );
        const embed = createEmbed()
            .setTitle(`List of CTF Challenges`)
            .setDescription(`Challenges for you <@${user.userId}>:\n${list || 'No challenges for you.'}`);

        this.message.channel.send(embed);
    }

    delete = async (): Promise<void> => {
        const args = this.getArgs(['id']);
        const challengeId = this.parseChallengeId(args.id);

        const challenge = await Challenge.getByGuild(challengeId, this.message.guild.id);
        if (!challenge) {
            this.message.channel.send(`Challenge ${args.id} does not exist.`);
            return;
        }

        if (challenge.author.userId !== this.message.author.id) {
            this.message.channel.send('You do not have permission to delete this challenge.');
            return;
        }

        await challenge.remove();
        this.message.channel.send(`<@${this.message.author.id}> removed challenge ${args.id}.`);
        this.updateChallengeList();
    }

    info = async (): Promise<void> => {
        const args = this.getArgs(['id']);
        const challengeId = this.parseChallengeId(args.id);

        const challenge = await Challenge.getByGuild(challengeId, this.message.guild.id);
        if (!challenge) {
            this.message.channel.send(`Challenge ${args.id} does not exist.`);
            return;
        }

        const author = this.message.client.users.cache.get(challenge.author.userId);
        const embed = createEmbed()
            .setAuthor(author.username, author.avatarURL())
            .setTitle(`CTF ${args.id}: ${challenge.title}`)
            .setDescription(challenge.description)
            .addField('Difficulty', `Level ${challenge.level}`, true)
            .addField('Solvers', challenge.answers.length, true);

        this.message.channel.send(embed);
    }
}
