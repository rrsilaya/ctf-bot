import { User } from 'discord.js';

export const mention = (user: User) => `<@${user.id}>`;
