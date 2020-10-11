import { Message } from 'discord.js';
import {
    ServerController,
} from '@controllers';
import { createEmbed } from '@utils';
import { mention } from '@utils/discord';
import { CommandUsage, Command } from '../constants';

export class BotController {
    private server: ServerController;

    handle = (message: Message, command: Command): void => {
        this.server = new ServerController({ message });

        const mapping = {
            [Command.PING]: this.ping,
            [Command.CONFIG]: this.server.initialize,
            // [Command.CREATE]: this.challenge.create,
            // [Command.SET_FLAG]: this.challenge.setFlag,
            // [Command.SUBMIT]: this.challenge.submit,
            [Command.LEADERBOARD]: this.server.getLeaderboard,
            // [Command.LIST]: this.challenge.list,
            // [Command.INFO]: this.challenge.info,
            // [Command.DELETE]: this.challenge.delete,
            [Command.HELP]: this.help,
        };

        if (!(command in mapping)) {
            return this.error(message);
        }

        mapping[command]();
    }

    private error = (message: Message): void => {
        message.channel.send(`${mention(message.author)} I wasn't able to recognize what you wanted to do.`);
    };

    private ping = (message: Message): void => {
        message.channel.send(`${mention(message.author)} pong`);
    };

    private help = (message: Message): void => {
        const embed = createEmbed()
            .setTitle('CTF Bot Commands')
            .setDescription('To interact with CTF bot, use `-ctf` followed by any of the commands below.')
            .addFields(CommandUsage.map((command) => ({
                name: `\`${command.command}\``,
                value: command.description,
                inline: true,
            })));

        message.channel.send(embed);
    }
}
