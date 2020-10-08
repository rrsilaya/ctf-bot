import * as dotenv from 'dotenv';

dotenv.config();

const {
    DISCORD_CLIENT_ID,
    BOT_TOKEN,
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
} = process.env;

export const Secrets = {
    DISCORD_CLIENT_ID,
    BOT_TOKEN,
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
};

export enum Command {
    PING = 'ping',
    CONFIG = 'config',
    CREATE = 'create',
    SET_FLAG = 'set-flag',
    SUBMIT = 'submit',
    LEADERBOARD = 'leaderboard',
    LIST = 'list',
    INFO = 'info',
    DELETE = 'delete',
    HELP = 'help',
};
