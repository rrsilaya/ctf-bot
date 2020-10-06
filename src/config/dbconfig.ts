import { createConnection } from 'typeorm';
import * as Entities from '@models';
import { Secrets } from '../constants';

const {
    TYPEORM_HOST,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
    TYPEORM_PORT,
} = Secrets;

const connection = () => createConnection({
    type: 'mysql',
    host: TYPEORM_HOST,
    port: +TYPEORM_PORT,
    synchronize: false,
    logging: false,
    dropSchema: false,

    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,

    entities: [ ...Object.values(Entities) ],
});

export default connection;
