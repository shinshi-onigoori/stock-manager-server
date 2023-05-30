import { RowDataPacket } from "mysql2";
import { Portfolio } from "../../../entity/repository/portfolio";
import { Stock } from "../../../entity/repository/stock";
import { PortfolioRepository } from "../../../domain/repository/portfolioRepository";
import { LOGGER } from "../../../logging";
import { MysqlRepositoryBase } from "./mysqlRepositoryBase";
import { Table } from "../../../const/table";

export class PortfolioRepositoryMysql extends MysqlRepositoryBase implements PortfolioRepository {
    constructor() {
        super();
    }
    readonly TABLE_NAME = Table.PORTFOLIO

    async findByUserId(userId: string): Promise<(Portfolio & Stock)[]> {
        const stocksMasterTable = Table.STOCKS_MASTER
        const query = `SELECT ${stocksMasterTable}.code, ${stocksMasterTable}.name, holding_amount, ${stocksMasterTable}.close_at_today, ${stocksMasterTable}.close_at_previous_day, ${stocksMasterTable}.yield, close_at_purchase FROM ${this.TABLE_NAME} JOIN ${stocksMasterTable} ON stock_id = ${stocksMasterTable}.id WHERE user_id = ?`
        const results = await this.executeQuery(query, [userId]);
        LOGGER.debug("[PortfolioRepositoryMysql::findByUserId] Query executed.")
        const resultRows = (results[0] as RowDataPacket[]);
        const portfolioList = resultRows.map((row) => {
            const holdingStock: Portfolio & Stock = {
                code: row.code,
                name: row.name,
                holdingAmount: row.holding_amount,
                closeAtToday: row.close_at_today,
                closeAtPreviousDay: row.close_at_previous_day,
                closeAtPurchase: row.close_at_purchase,
                yield: row.yield
            }
            LOGGER.debug(holdingStock)
            return holdingStock;
        });
        return portfolioList;
    }
}