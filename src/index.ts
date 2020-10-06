import 'reflect-metadata';
import connection from './config/dbconfig';
import CtfBot from './bot';

connection()
    .then(() => {
        console.log('> Successfully connected database');

        const bot = new CtfBot();

        bot.init();
        bot.listen();
    })
    .catch(({ code, sqlMessage }) => {
        console.log(`Failure to connect to database: ${sqlMessage} [${code}]`);
    });
