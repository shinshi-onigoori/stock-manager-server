import express from 'express';
import { LOGGER } from '../../logging';
import { PortfolioService } from '../../usecase/portfolioService';
import { PortfolioRepositoryMysql } from '../../infrastructure/repository/mysql/portfolioRepositoryMysql';

const router = express.Router()
const portfolioService = new PortfolioService(new PortfolioRepositoryMysql)

router.get("/:userId",
  async (req, res) => {
    LOGGER.debug(`[portfolioController] ${req.method} -> ${req.url}`);
    const portfolio = await portfolioService.getPortfolioOfUser(req.params.userId);
    return res.status(200).json({
      portfolio: portfolio
    });
  })

export const portfolioRouter = router;