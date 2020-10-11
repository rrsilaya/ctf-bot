import { Message } from 'discord.js';
import { Server } from '@models';
import { mention } from '@utils/discord';
import { BotError, ErrorCode } from '../errors';

export const serverConfigured = async (message: Message): Promise<Server> => {
    const server = await Server.findOne({ guildId: message.guild.id });

    if (!server) {
        message.channel.send(`${mention(message.author)} CTF Bot is not yet configured for this server.`);
        throw new BotError(ErrorCode.SERVER_NOT_FOUND);
    }

    return server;
}
