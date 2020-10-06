import { BaseEntity, Entity } from 'typeorm';
import { validate as validator } from 'class-validator';
import { BotError, ErrorCode } from '../errors';

@Entity()
export class ValidEntity extends BaseEntity {
    validate = () => new Promise(async (resolve, reject) => {
        const errors = await validator(this);

        if (!errors.length) resolve();

        reject(
            new BotError(
                ErrorCode.INVALID_INPUT,
                errors.reduce((err, { constraints }) => {
                    err.push(...Object.values(constraints));
                    return err;
                }, []).join(', ')
            )
        );
    });
}

export default ValidEntity;
