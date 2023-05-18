import { Portfolio } from "../../entity/repository/portfolio";
import { Stock } from "../../entity/repository/stock";

export interface PortfolioRepository {
    findByUserId(userId: string): Promise<(Portfolio & Stock)[]>
}