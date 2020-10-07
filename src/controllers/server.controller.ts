import { Message } from 'discord.js';
import { Server } from '@models';
import { UserHandler, ServerHandler } from '@handlers';
import { BaseController } from './base.controller';

export class ServerController extends BaseController {
    initialize = async (message: Message): Promise<void> => {
        const { channelName } = this.getArgs(message, ['channelName']);

        const channel = message.guild.channels.cache.find(channel => (
            channel.name === channelName
        ));

        if (!channel) {
            message.channel.send(`Channel "${channelName}" not found.`);
            return;
        }

        await ServerHandler.initialize(message.guild.id, channel.id);
        message.channel.send(`CTF Challenges channel has been configured to <#${channel.id}>`);
    };

    getLeaderboard = async (message: Message): Promise<void> => {
        const server = await Server.findOne({ guildId: message.guild.id });
        const leaderboard = await UserHandler.getLeaderboard(server);

        if (!leaderboard.length) {
            message.channel.send('No data for leaderboard yet.');
        }

        const ranking = leaderboard.reduce((ranking, user, rank) => `${ranking}${rank + 1}. <@${user.userId}> (${user.score} pts.)\n`, '');
        message.channel.send(`**LEADERBOARDS**\n${ranking}`);
    }
}
