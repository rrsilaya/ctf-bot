import { Client, Message, User } from 'discord.js';
import {
    ChallengeController,
    ServerController,
} from '@controllers';
import { Command, Secrets } from './constants';

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
        try {
            switch (command) {
                case Command.PING:
                    this.ping(message);
                    break;

                case Command.CONFIG:
                    this.server.initialize(message);
                    break;

                case Command.CREATE:
                    this.challenge.create(message);
                    break;

                case Command.SET_FLAG:
                    this.challenge.setFlag(message);
                    break;

                case Command.SUBMIT:
                    this.challenge.submit(message);
                    break;

                // case Command.TEST:
                //     this.challenge.test(message);
                //     break;

                default:
                    this.error(message);
                    break;
            }
        } catch (error) {
            console.log(error);

            const message = error.message || 'An error occured.';
            message.channel.send(`${CtfBot.mention(message.author)} ${message}`);
        }
    }

    public static mention = (user: User): string => {
        return `<@${user.id}>`;
    }

    private error = (message: Message): void => {
        message.channel.send(`${CtfBot.mention(message.author)} I wasn't able to recognize what you wanted to do.`);
    };

    private ping = (message: Message): void => {
        message.channel.send('pong');
    };
}

export default CtfBot;
