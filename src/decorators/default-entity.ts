import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';
import ValidEntity from './valid-entity';

export class DefaultEntity extends ValidEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    active: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeInsert()
    updateDateCreation() {
        this.createdAt = new Date();
    }

    @BeforeUpdate()
    updateDateUpdate() {
        this.updatedAt = new Date();
    }
}
