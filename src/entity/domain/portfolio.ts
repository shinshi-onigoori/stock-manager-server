export type Portfolio = {
    code: number,
    name: string,
    close: number,
    yield: number,
    closeRatioFromPreviousDay: number,
    closeRatioFromPurchaseDay: number,
    holdingAmount: number,
    totalAssetPrice: number
}