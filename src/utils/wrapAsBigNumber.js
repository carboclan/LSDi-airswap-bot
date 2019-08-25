import BigNumber from 'bignumber.js';

export const wrapAsBigNumber = async prom => BigNumber(await prom);
