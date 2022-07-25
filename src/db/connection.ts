import { verbose } from "sqlite3";
import { open, Database, Statement } from 'sqlite';
import { logBotError } from "../utils/Logger";
import FS from 'fs';

const sqlite3 = verbose();

export async function initDb() {
    try {
        const db = await open({
            filename: './src/db/gummy.db',
            driver: sqlite3.Database
        });
        db.exec(FS.readFileSync(__dirname + '/Schemas.sql').toString());
        return db;
    } catch (err) {
        console.error(err);
        if( err instanceof Error) logBotError(err);
    }
}