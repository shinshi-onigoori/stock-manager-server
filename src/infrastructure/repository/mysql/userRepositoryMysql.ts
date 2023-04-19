import { RowDataPacket } from "mysql2";
import { User } from "../../../domain/entity/user"
import { UserRepository } from "../../../domain/repository/userRepository";
import { MysqlRepositoryBase } from "./mysqlRepositoryBase";

export class UserRepositoryMysql extends MysqlRepositoryBase implements UserRepository {
    constructor() {
        super();
    }
    private readonly TABLE_NAME = "user";
    // TODO テーブル構造そのものを示すクラス(列挙型?)を作って、プログラム上の定数としてカラムを扱えたほうが、SQLを生成するの楽かも

    async findById(id: string): Promise<User> {
        const query = `SELECT id, display_name FROM ${this.TABLE_NAME} WHERE id = ?;`;
        const results = await this.executeQuery(query, [id]);
        const result = results[0] as RowDataPacket[];
        const userRow = result[0];
        return {
            id: userRow.id,
            displayName: userRow.display_name
        }
    }

    async create(user: User): Promise<void> {
        const query = `INSERT INTO ${this.TABLE_NAME} (id, display_name) VALUES (?, ?);`;
        const results = await this.executeQuery(query, [user.id, user.displayName]);
        console.log(results);
    }

    update(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

}