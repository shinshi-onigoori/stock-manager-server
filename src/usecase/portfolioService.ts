import { Portfolio } from "../entity/domain/portfolio";
import { PortfolioRepository } from "../domain/repository/portfolioRepository";
import { Portfolio as PortfolioDB } from "../entity/repository/portfolio";
import { Stock } from "../entity/repository/stock";

export class PortfolioService {
    private portfolioRepository: PortfolioRepository
    public constructor(portfolioRepository: PortfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    async getPortfolioOfUser(userId: string): Promise<Portfolio[]> {
        const holdingStockOfUser: (PortfolioDB & Stock)[] = await this.portfolioRepository.findByUserId(userId);
        const portfolioList = holdingStockOfUser.map((record) => {
            const closeRatioFromPreviousDay = (record.closeAtToday && record.closeAtPreviousDay) ? record.closeAtToday / record.closeAtPreviousDay : NaN
            const closeRatioFromPurchaseDay = (record.closeAtToday && record.closeAtPurchase) ? record.closeAtToday / record.closeAtPurchase : NaN
            const totalAssetPrice = (record.closeAtToday && record.holdingAmount) ? record.closeAtToday * record.holdingAmount : NaN
            const portfolio: Portfolio = {
                code: record.code? record.code: NaN,
                name: record.name? record.name: "",
                close: record.closeAtToday? record.closeAtToday: NaN,
                yield: record.yield? record.yield: NaN,
                closeRatioFromPreviousDay: closeRatioFromPreviousDay,
                closeRatioFromPurchaseDay: closeRatioFromPurchaseDay,
                holdingAmount: record.holdingAmount? record.holdingAmount: NaN,
                totalAssetPrice: totalAssetPrice
            } 
            return portfolio
        })
        return portfolioList;
    }
}