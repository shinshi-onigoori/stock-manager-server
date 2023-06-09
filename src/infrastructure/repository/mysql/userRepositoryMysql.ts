import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../../../entity/domain/user"
import { UserRepository } from "../../../domain/repository/userRepository";
import { MysqlRepositoryBase } from "./mysqlRepositoryBase";
import { LOGGER } from "../../../logging";

export class UserRepositoryMysql extends MysqlRepositoryBase implements UserRepository {
    constructor() {
        super();
    }
    readonly TABLE_NAME = "user";
    // TODO テーブル構造そのものを示すクラス(列挙型?)を作って、プログラム上の定数としてカラムを扱えたほうが、SQLを生成するの楽かも

    async findById(id: string): Promise<User> {
        const query = `SELECT id, display_name FROM ${this.TABLE_NAME} WHERE id = ?;`;
        const results = await this.executeQuery(query, [id]);
        LOGGER.debug("[UserRepositoryMysql::findById] Query executed.");
        const resultRow = (results[0] as RowDataPacket[])[0];
        const user = {
            id: resultRow.id,
            displayName: resultRow.display_name
        };
        LOGGER.debug(`[UserRepositoryMysql::findById] User: {\n\tid: ${user.id}\n\tdisplayName: ${user.displayName}\n\t}`);
        return user;
    }

    async create(user: User): Promise<void> {
        const query = `INSERT INTO ${this.TABLE_NAME} (id, display_name) VALUES (?, ?);`;
        const results = await this.executeQuery(query, [user.id, user.displayName]);
        LOGGER.debug("[UserRepositoryMysql::create] Query executed.");
        const resultSet = results[0] as ResultSetHeader
        LOGGER.debug(`[UserRepositoryMysql::create] Inserted Record: ${resultSet.affectedRows}`);
    }

    update(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}