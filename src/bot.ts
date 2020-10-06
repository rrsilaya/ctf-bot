import { Client, Message } from 'discord.js';
import { Command, Secrets } from './constants';

class CtfBot {
    private client: Client = new Client();
    private keyword: string;

    constructor(keyword: string = '-ctf') {
        this.keyword = `${keyword} `;
    }

    init = () => {
        this.client.login(Secrets.BOT_TOKEN);
    };

    listen = () => {
        console.log('> Bot started listening');

        this.client.on('message', (message: Message) => {
            if (!message.content.startsWith(this.keyword)) return;

            const text = message.content.replace(this.keyword, '');
            if (!text) {
                this.error(message);
                return;
            }

            const [command, ...args] = text.split(' ');

            switch (command) {
                case Command.PING:
                    this.ping(message);
                    break;

                default:
                    this.error(message);
                    break;
            }
        });
    };

    private error = (message: Message): void => {
        message.channel.send('I don\'t recognize what you wanted to do.');
    };

    private ping = (message: Message): void => {
        message.channel.send('pong');
    };
}

export default CtfBot;
