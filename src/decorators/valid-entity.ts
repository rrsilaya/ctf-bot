import { BaseEntity, Entity } from 'typeorm';
import { validate as validator } from 'class-validator';

@Entity()
export class ValidEntity extends BaseEntity {
    validate = () => new Promise(async (resolve, reject) => {
        const errors = await validator(this);

        if (!errors.length) resolve();

        reject({
            code: 'INVALID_INPUT',
            errors: errors.reduce((err, { constraints }) => {
                err.push(...Object.values(constraints));
                return err;
            }, []),
        });
    });
}

export default ValidEntity;
