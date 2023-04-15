// continue tests from here
const {getBalance, getDecimals} = require("../modules/web3");


describe('Web3 module functions', () => {
    test('Check web3 balance', async () => {
        const daiContract = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
        const randomWallet = '0xeb6c306602b2a47b239ef57e15ccfa222547be18'
        const balance = await getBalance(daiContract, randomWallet);
        expect(balance).toBe(0)
    });
    test('Check web3 decimals', async () => {
        const daiContract = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
        const decimals = await getDecimals(daiContract);
        expect(decimals).toBe(18);
    });
})
