require('dotenv').config();

const {
    TYPEORM_HOST,
    TYPEORM_PORT,
    TYPEORM_USERNAME,
    TYPEORM_PASSWORD,
    TYPEORM_DATABASE,
} = process.env;

module.exports = {
    type: 'mysql',
    host: TYPEORM_HOST,
    port: +TYPEORM_PORT,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,
    migrations: ['migrations/*.js'],
    cli: {
        migrationsDir: 'migrations'
    },
    logging: true,
    entities: [
        'src/models/!(index).ts',
    ],
    synchronize: false,
};
