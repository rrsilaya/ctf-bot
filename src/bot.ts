import {
    Client,
    Message,
    MessageEmbed,
    User,
} from 'discord.js';
import { ChallengeController, ServerController } from '@controllers';
import {
    Command,
    CommandUsage,
    Color,
    Secrets,
} from './constants';

class CtfBot {
    private client: Client = new Client();
    private keyword: string;

    private challenge = new ChallengeController();
    private server = new ServerController();

    constructor(keyword: string = '-ctf') {
        this.keyword = `${keyword} `;
    }

    init = () => {
        this.client.login(Secrets.BOT_TOKEN);
    };

    listen = () => {
        this.client.on('ready', () => {
            console.log('> Bot started listening');
        });

        this.client.on('message', (message: Message) => {
            if (!message.content.startsWith(this.keyword)) return;

            const text = message.content.replace(this.keyword, '');
            message.content = text;

            if (!text) {
                this.error(message);
                return;
            }

            const [command] = text.split(' ');
            this.handleCommand(message, command);
        });
    };

    private handleCommand = (message: Message, command: string): void => {
        const mapping = {
            [Command.PING]: this.ping,
            [Command.CONFIG]: this.server.initialize,
            [Command.CREATE]: this.challenge.create,
            [Command.SET_FLAG]: this.challenge.setFlag,
            [Command.SUBMIT]: this.challenge.submit,
            [Command.LEADERBOARD]: this.server.getLeaderboard,
            [Command.LIST]: this.challenge.list,
            [Command.INFO]: this.challenge.info,
            [Command.DELETE]: this.challenge.delete,
            [Command.HELP]: this.help,
        };

        if (!(command in mapping)) {
            return this.error(message);
        }

        mapping[command](message);
    }

    public static mention = (user: User): string => {
        return `<@${user.id}>`;
    }

    private error = (message: Message): void => {
        message.channel.send(`${CtfBot.mention(message.author)} I wasn't able to recognize what you wanted to do.`);
    };

    private ping = (message: Message): void => {
        message.channel.send(`${CtfBot.mention(message.author)} pong`);
    };

    private help = (message: Message): void => {
        const embed = new MessageEmbed()
            .setColor(Color.DEFAULT)
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

export default CtfBot;
