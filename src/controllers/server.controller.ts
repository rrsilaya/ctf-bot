import { UserHandler, ServerHandler } from '@handlers';
import { BaseController } from './base.controller';
import { createEmbed } from '@utils';

export class ServerController extends BaseController {
    initialize = async (): Promise<void> => {
        const { mention } = this.getArgs(['mention']);

        const regex = /^<#([0-9]+)>$/;
        if (!regex.test(mention)) {
            this.messageAuthor('Invalid channel provided.');
            return;
        }

        const [, channelId] = mention.match(regex);

        const server = await ServerHandler.initialize(this.message.guild.id, channelId);
        this.setServer(server);

        this.message.channel.send(`CTF Challenges channel has been configured to <#${channelId}>.`);

        // Send initial stuff here
        await this.loadAnnouncement();

        // Check if server has initial data
        const data = {
            leaderboard: await UserHandler.getLeaderboard(this.server),
        };

        if (!this.challengeList) {
            const challenges = createEmbed()
                .setTitle('List of CTF Challenges')
                .setDescription('No challenges yet. Please add one to start the fun!');
            const message = await this.announcement.send(challenges);

            message.pin();
        }

        if (!this.leaderboard) {
            const ranking = data.leaderboard.reduce((ranking, user, rank) => (
                `${ranking}${rank + 1}. <@${user.userId}> (${user.score} pts.)\n`
            ), '');

            const leaderboard = createEmbed()
                .setTitle('Leaderboard')
                .setDescription(ranking || 'No data for leaderboard yet.');
            const message = await this.announcement.send(leaderboard);

            message.pin();
        }
    };

    getLeaderboard = async (): Promise<void> => {
        const { channel } = this.message;
        const leaderboard = await UserHandler.getLeaderboard(this.server);

        if (!leaderboard.length) {
            channel.send('No data for leaderboard yet.');
            return;
        }

        const ranking = leaderboard.reduce((ranking, user, rank) => `${ranking}${rank + 1}. <@${user.userId}> (${user.score} pts.)\n`, '');
        const embed = createEmbed()
            .setTitle('Leaderboard')
            .setDescription(ranking);

        channel.send(embed);
    }
}
