import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '@decorators';
import { User } from './user';

@Entity()
export class Server extends DefaultEntity {
    @Column()
    guildId: string;

    @Column()
    channelId: string;

    @ManyToOne(type => User, user => user.server)
    users: User[];
}
