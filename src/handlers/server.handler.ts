import { Server } from '@models';

export class ServerHandler {
    static initialize = async (guildId: string, channelId: string): Promise<Server> => {
        let server = await Server.findOne({ guildId });

        if (!server) {
            server = new Server();
            server.guildId = guildId;
        }

        server.channelId = channelId;
        await server.save();

        return server;
    };
}
