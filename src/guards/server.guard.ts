import { Message } from 'discord.js';
import { Server } from '@models';
import { mention } from '@utils/discord';
import { BotError, ErrorCode } from '../errors';

export class ServerGuard {
    static getServer = async (message: Message, shouldError = true): Promise<Server> => {
        const server = await Server.findOne({ guildId: message.guild.id });

        if (shouldError && !server) {
            message.channel.send(`${mention(message.author)} CTF Bot is not yet configured for this server.`);
            throw new BotError(ErrorCode.SERVER_NOT_FOUND);
        }

        return server;
    }
}
