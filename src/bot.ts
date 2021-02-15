import { Client, Message } from 'discord.js';
import { BotController } from '@controllers';
import { regex } from '@utils';
import { Command, Secrets } from './constants';

class CtfBot {
    static NAMESPACE = '-ctf';

    private client: Client = new Client();

    init = () => {
        this.client.login(Secrets.BOT_TOKEN);
    };

    listen = () => {
        this.client.on('ready', () => {
            console.log('> Bot started listening');
        });

        this.client.on('message', (message: Message) => {
            const pattern = new RegExp(`^${CtfBot.NAMESPACE} (.+)`);

            if (!pattern.test(message.content)) return;

            const [, text] = message.content.match(pattern);
            message.content = text;

            const [, command] = text.match(regex.COMMAND);

            const bot = new BotController(message);
            bot.handle(command as Command);
        });
    };
}

export default CtfBot;
