
import { CONNECTION } from "../../driver/mysqlConnector";

export abstract class MysqlRepositoryBase {
    constructor() { }

    protected async executeQuery(query: string, values: Array<number | string | boolean>) {
        const connection = await CONNECTION
        await connection.beginTransaction()
        const result = connection.query({
            sql: query,
            values: values
        }).then(async (result) => {
            await connection.commit();
            return result;
        }).catch(async (err) => {
            await connection.rollback()
            console.error(err);
            throw err;
        })
        return (await result);
    }
}