import {
    APPROVE_LP_FARM,
    SHOW_FARM_LOADING,
    HIDE_FARM_LOADING,
    STAKE_LP_TOKENS,
    GET_LP_BALANCE_FARM,
    UPDATE_TRANSACTION_STATUS,
    START_TRANSACTION,
} from "./types";
import {
    farmContract,
    pairContract,
} from "../contracts/connections";
import { currentConnection, farmAddresses } from "../constants";
import BigNumber from "bignumber.js";


const getLoadingObject = (_key, flag) => {
    const obj = {};
    obj[_key] = flag;
    return obj;
}

export const checkLpFarmAllowance =
    (pairAddress, account, network) => async (dispatch) => {
        try {

            console.log('farmTest  checking allowance', { pairAddress, account, network })
            const _pairContract = pairContract(pairAddress, network);
            const _farmAddress = currentConnection === 'mainnet' ? farmAddresses.ethereum.mainnet : farmAddresses.ethereum.testnet;

            dispatch({
                type: SHOW_FARM_LOADING,
                payload: getLoadingObject(pairAddress, true)
            });

            const lpAllowance = await _pairContract.methods
                .allowance(account, _farmAddress)
                .call();

            console.log("farmTest allowance ", lpAllowance);
            const apprvedObj = {};
            if (new BigNumber(lpAllowance).gt(0)) {

                apprvedObj[pairAddress] = true;

            } else {

                apprvedObj[pairAddress] = false;

            }

            dispatch({
                type: APPROVE_LP_FARM,
                payload: apprvedObj,
            });

        } catch (error) {
            console.log("farmTest checkLpFarmAllowance ", error);
        }

        dispatch({
            type: HIDE_FARM_LOADING,
            payload: getLoadingObject(pairAddress, false)
        });
    };


export const confirmLpFarmAllowance = (allowanceAmount, pairAddress, account, network) => async (dispatch) => {
    try {

        const _pairContract = pairContract(pairAddress, network);
        const _farmAddress = currentConnection === 'mainnet' ? farmAddresses.ethereum.mainnet : farmAddresses.ethereum.testnet;

        dispatch({
            type: SHOW_FARM_LOADING,
            payload: getLoadingObject(pairAddress, true)
        });

        dispatch({ type: START_TRANSACTION })

        await _pairContract.methods
            .approve(_farmAddress, allowanceAmount)
            .send({ from: account }, function (error, transactionHash) {

                // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
                if (error) {
                    dispatch({
                        type: UPDATE_TRANSACTION_STATUS,
                        payload: { type: 'approve', hash: null, status: 'failed' }
                    })
                } else {
                    dispatch({
                        type: UPDATE_TRANSACTION_STATUS,
                        payload: { type: 'approve', hash: transactionHash, }
                    })
                }

            }).on('receipt', async function (receipt) {

                // console.log('UPDATE_TRANSACTION_STATUS', receipt)
                dispatch({
                    type: UPDATE_TRANSACTION_STATUS,
                    payload: { type: 'approve', status: 'success' }
                })

            }).on("error", async function (error) {

                // console.log('UPDATE_TRANSACTION_STATUS error', error)
                dispatch({
                    type: UPDATE_TRANSACTION_STATUS,
                    payload: { type: 'approve', status: 'failed' }
                })

            });

        const apprvedObj = {};
        apprvedObj[pairAddress] = true;
        dispatch({
            type: APPROVE_LP_FARM,
            payload: apprvedObj,
        });

    } catch (error) {
        console.log("confirmLpFarmAllowance ", error);
    }
    dispatch({
        type: HIDE_FARM_LOADING,
        payload: getLoadingObject(pairAddress, false)
    });
};

export const stakeLpTokens = (lpAmount, pairAddress, pid, account, network) => async (dispatch) => {
    try {

        const _farmContract = farmContract(network);

        dispatch({
            type: SHOW_FARM_LOADING,
            payload: getLoadingObject(pairAddress, true)
        })

        dispatch({ type: START_TRANSACTION })

        const stakeRes = await _farmContract.methods.stake(pid, lpAmount)
            .send({ from: account }, function (error, transactionHash) {

                // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
                if (error) {
                    dispatch({
                        type: UPDATE_TRANSACTION_STATUS,
                        payload: { type: 'stake', hash: null, status: 'failed' }
                    })
                } else {
                    dispatch({
                        type: UPDATE_TRANSACTION_STATUS,
                        payload: { type: 'stake', hash: transactionHash }
                    })
                }

            }).on('receipt', async function (receipt) {

                // console.log('UPDATE_TRANSACTION_STATUS', receipt)
                dispatch({
                    type: UPDATE_TRANSACTION_STATUS,
                    payload: { type: 'stake', status: 'success' }
                })

            }).on("error", async function (error) {

                // console.log('UPDATE_TRANSACTION_STATUS error', error)
                dispatch({
                    type: UPDATE_TRANSACTION_STATUS,
                    payload: { type: 'stake', status: 'failed' }
                })

            });


        console.log('stakeLpTokens staked amount ', stakeRes);

        dispatch({
            type: STAKE_LP_TOKENS,
            payload: lpAmount
        });

    } catch (error) {
        console.log('stakeLpTokens', error)
    }
    dispatch({
        type: HIDE_FARM_LOADING,
        payload: getLoadingObject(pairAddress, false)
    })
};

export const unstakeLpTokens = (lpAmount, pairAddress, pid, account, network) => async (dispatch) => {
    try {
        const _farmContract = farmContract(network);

        dispatch({
            type: SHOW_FARM_LOADING,
            payload: getLoadingObject(pairAddress, true)
        });

        dispatch({ type: START_TRANSACTION });

        const stakeRes = await _farmContract.methods.unstake(pid, lpAmount)
            .send({ from: account }, function (error, transactionHash) {

                // console.log('UPDATE_TRANSACTION_STATUS hash', { transactionHash, error })
                if (error) {
                    dispatch({
                        type: UPDATE_TRANSACTION_STATUS,
                        payload: { type: 'stake', hash: null, status: 'failed' }
                    })
                } else {
                    dispatch({
                        type: UPDATE_TRANSACTION_STATUS,
                        payload: { type: 'stake', hash: transactionHash }
                    })
                }

            }).on('receipt', async function (receipt) {

                // console.log('UPDATE_TRANSACTION_STATUS', receipt)
                dispatch({
                    type: UPDATE_TRANSACTION_STATUS,
                    payload: { type: 'stake', status: 'success' }
                })

            }).on("error", async function (error) {

                // console.log('UPDATE_TRANSACTION_STATUS error', error)
                dispatch({
                    type: UPDATE_TRANSACTION_STATUS,
                    payload: { type: 'stake', status: 'failed' }
                })

            });


        console.log('unstaked amount ', stakeRes);

        dispatch({
            type: STAKE_LP_TOKENS,
            payload: lpAmount
        });
    } catch (error) {
        console.log('unstakeLpTokens', error)
    }

    dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, false)
    });

};


export const getFarmInfo = (pairAddress, pid, account, network) => async (dispatch) => {
    try {
        const _farmContract = farmContract(network);
        const _pairContract = pairContract(pairAddress, network);

        dispatch({
            type: SHOW_FARM_LOADING,
            payload: getLoadingObject(pairAddress, true)
        });

        // getMultiplier(pool.lastRewardBlock, block.number)
        //

        const [pbrPerBlock, poolInfo, pendingPbr, userInfo, totalSupply] = await Promise.all([
            _farmContract.methods.PBRPerBlock().call(),
            _farmContract.methods.poolInfo(pid).call(),
            _farmContract.methods.pendingPBR(pid, account).call(),
            _farmContract.methods.userInfo(pid, account).call(),
            _pairContract.methods.totalSupply().call()
        ]);


        console.log('getFarmInfo ', { pbrPerBlock, poolInfo, pendingPbr, userInfo })
        const farmPoolObj = {};
        farmPoolObj[pairAddress] = {
            pendingPbr: pendingPbr,
            stakeData: userInfo,
            poolInfo: { ...poolInfo, pbrPerBlock },
            totalLiquidity: totalSupply
        };

        dispatch({
            type: STAKE_LP_TOKENS,
            payload: farmPoolObj
        });

    } catch (error) {
        console.log('getFarmInfo', { error, pid, account, pairAddress })
    }

    dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, false)
    });
};



export const getLpBalanceFarm = (pairAddress, account, network) => async (dispatch) => {
    try {

        const _pairContract = pairContract(pairAddress, network);


        dispatch({
            type: SHOW_FARM_LOADING,
            payload: getLoadingObject(pairAddress, true)
        });

        const [lpBalance, token0Addr, token1Addr, reservesData, totalSupply] =
            await Promise.all([
                _pairContract.methods.balanceOf(account).call(),
                _pairContract.methods.token0().call(),
                _pairContract.methods.token1().call(),
                _pairContract.methods.getReserves().call(),
                _pairContract.methods.totalSupply().call(),
            ]);

        let reserve = {};
        reserve[token0Addr] = reservesData._reserve0;
        reserve[token1Addr] = reservesData._reserve1;

        const balObject = {};
        balObject[pairAddress] = {
            lpBalance,
            totalLpTokens: totalSupply,
            poolReserves: reserve
        };

        // console.log('farmTest:  lp bal', { balWei, pairAddress })
        dispatch({
            type: GET_LP_BALANCE_FARM,
            payload: balObject
        });

    } catch (error) {
        console.log('getLpBalanceFarm ', error)
    }


    dispatch({
        type: SHOW_FARM_LOADING,
        payload: getLoadingObject(pairAddress, false)
    });
};


export const harvestReward = () => async (dispatch) => {
    try {
        //todo

        dispatch({ type: START_TRANSACTION })
    } catch (error) {
        console.log('harvestReward', error)
    }
};