import { Client, Message } from 'discord.js';
import { BotController } from '@controllers';
import { Command, Secrets } from './constants';

class CtfBot {
    static NAMESPACE = '-ctf';

    private client: Client = new Client();
    private bot: BotController =  new BotController();

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

            const [, command] = text.match(/^(\w+)/);
            this.bot.handle(message, command as Command);
        });
    };
}

export default CtfBot;
