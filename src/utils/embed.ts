import { MessageEmbed } from 'discord.js';
import { Secrets, Color } from '../constants';

export const createEmbed = (): MessageEmbed => {
    return new MessageEmbed()
        .setColor(Color.DEFAULT)
        .setThumbnail(Secrets.BOT_AVATAR);
};
