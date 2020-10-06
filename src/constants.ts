import * as dotenv from 'dotenv';

dotenv.config();

const {
    DISCORD_CLIENT_ID,
    BOT_TOKEN,
} = process.env;

export const Secrets = {
    DISCORD_CLIENT_ID,
    BOT_TOKEN,
};

export enum Command {
    PING = 'ping',
};
