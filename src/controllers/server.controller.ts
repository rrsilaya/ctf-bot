import { Message } from 'discord.js';
import { ServerHandler } from '@handlers';
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
}
