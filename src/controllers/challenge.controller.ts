import { Message} from 'discord.js';
import { ChallengeHandler, UserHandler } from '@handlers';
import {
    Challenge,
    Server,
    User,
} from '@models';
import { BaseController } from './base.controller';

export class ChallengeController extends BaseController {
    create = async (message: Message): Promise<void> => {
        const args = this.getArgs(message, [
            'level',
            'title',
            'description',
        ]);

        const server = await Server.findOne({ guildId: message.guild.id });
        const author = await User.registerOrFindOne(message.author.id, server);

        try {
            const challenge = await ChallengeHandler.create(
                +args.level,
                args.title,
                args.description,
                author,
                server
            );

            const ctfId = challenge.id.toString(16).padStart(4, '0');
            message.channel.send(`CTF 0x${ctfId}: ${args.title} created by <@${author.userId}>. Please set the flag to start the challenge.`);
        } catch (error) {
            message.channel.send(`Unable to create challenge: ${error.message}`);
        }
    }

    setFlag = async (message: Message): Promise<void> => {
        message.delete(); // Make sure to delete flag

        const args = this.getArgs(message, ['id', 'flag']);
        const flag = args.flag.replace(/\|\|/g, ''); // remove mark as spoiler

        const challengeId = parseInt(args.id.replace('0x', ''), 16);
        const challenge = await Challenge.findOne({
            where: { id: challengeId },
            relations: ['author'],
        });

        const authorId = message.author.id;

        if (!challenge) {
            message.channel.send(`Challenge ${args.id} does not exist.`);
            return;
        }

        if (challenge.author?.userId !== authorId) {
            message.channel.send(`<@${authorId}> You don't have permission to set the flag.`);
            return;
        }

        let shouldNotifyEveryone = true;
        if (challenge.flag) shouldNotifyEveryone = false;

        try {
            await ChallengeHandler.setFlag(challenge, flag);

            message.channel.send(`Successfully set flag to challenge ${args.id}`);

            if (shouldNotifyEveryone) {
                message.channel.send(`@everyone A new CTF challenge has been created by <@${authorId}>!\n\n**CTF ID:** ${args.id}\n**Title:** ${challenge.title}\n**Description/Clue:** ${challenge.description}\n**Level:** Level ${challenge.level}\n\nGood luck!`);
            }
        } catch (error) {
            message.channel.send(`Unable to set the flag: ${error.message}`);
        }
    }
}
