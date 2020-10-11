import { Message } from 'discord.js';
import { Server } from '@models';
import { UserHandler, ServerHandler } from '@handlers';
import { BaseController, ControllerArgs } from './base.controller';
import { createEmbed } from '@utils';

export class ServerController extends BaseController {
    initialize = async (): Promise<void> => {
        const { mention } = this.getArgs(['mention']);

        const regex = /^<#([0-9]+)>$/;
        if (!regex.test(mention)) {
            this.messageAuthor('Invalid channel provided.');
            return;
        }

        const [, channelId] = mention.match(regex);

        await ServerHandler.initialize(this.message.guild.id, channelId);
        this.message.channel.send(`CTF Challenges channel has been configured to <#${channelId}>`);

        // Send initial stuff here
    };

    getLeaderboard = async (): Promise<void> => {
        const { channel } = this.message;
        const leaderboard = await UserHandler.getLeaderboard(this.server);

        if (!leaderboard.length) {
            channel.send('No data for leaderboard yet.');
            return;
        }

        const ranking = leaderboard.reduce((ranking, user, rank) => `${ranking}${rank + 1}. <@${user.userId}> (${user.score} pts.)\n`, '');
        const embed = createEmbed()
            .setTitle('Leaderboard')
            .setDescription(ranking);

        channel.send(embed);
    }
}
