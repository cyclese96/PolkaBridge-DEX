import {
    APPROVE_LP_FARM,
    SHOW_FARM_LOADING,
    HIDE_FARM_LOADING,
    STAKE_LP_TOKENS,
    GET_LP_BALANCE_FARM,
} from "./types";
import {
    farmContract,
    pairContract,
} from "../contracts/connections";
import { currentConnection, farmAddresses } from "../constants";
import BigNumber from "bignumber.js";



export const checkLpFarmAllowance =
    (pairAddress, account, network) => async (dispatch) => {
        try {

            console.log('farmTest  checking allowance', { pairAddress, account, network })
            const _pairContract = pairContract(pairAddress, network);
            const _farmAddress = currentConnection === 'mainnet' ? farmAddresses.ethereum.mainnet : farmAddresses.ethereum.testnet;

            dispatch({
                type: SHOW_FARM_LOADING,
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
        });
    };


export const confirmLpFarmAllowance = (allowanceAmount, pairAddress, account, network) => async (dispatch) => {
    try {

        const _pairContract = pairContract(pairAddress, network);
        const _farmAddress = currentConnection === 'mainnet' ? farmAddresses.ethereum.mainnet : farmAddresses.ethereum.testnet;

        dispatch({
            type: SHOW_FARM_LOADING,
        });

        const lpAllowance = await _pairContract.methods
            .approve(_farmAddress, allowanceAmount)
            .send({ from: account });

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
    });
};

export const stakeLpTokens = (lpAmount, pid, account, network) => async (dispatch) => {
    try {

        const _farmContract = farmContract(network);

        const stakeRes = await _farmContract.methods.stake(pid, lpAmount).send({ from: account });


        console.log('stakeLpTokens staked amount ', stakeRes);

        dispatch({
            type: STAKE_LP_TOKENS,
            payload: lpAmount
        });

    } catch (error) {
        console.log('stakeLpTokens', error)
    }
};

export const unstakeLpTokens = (lpAmount, pid, account, network) => async (dispatch) => {
    try {
        const _farmContract = farmContract(network);

        dispatch({
            type: SHOW_FARM_LOADING
        });

        const stakeRes = await _farmContract.methods.unstake(pid, lpAmount).send({ from: account });


        console.log('unstaked amount ', stakeRes);

        dispatch({
            type: STAKE_LP_TOKENS,
            payload: lpAmount
        });
    } catch (error) {
        console.log('unstakeLpTokens', error)
    }
};


export const getFarmInfo = (pairAddress, pid, account, network) => async (dispatch) => {
    try {
        const _farmContract = farmContract(network);

        dispatch({
            type: SHOW_FARM_LOADING
        });

        // getMultiplier(pool.lastRewardBlock, block.number)
        //

        const [pbrPerBlock, poolInfo, pendingPbr, userInfo] = await Promise.all([
            _farmContract.methods.PBRPerBlock().call(),
            _farmContract.methods.poolInfo(pid).call(),
            _farmContract.methods.pendingPBR(pid, account).call(),
            _farmContract.methods.userInfo(pid, account).call(),
        ]);


        console.log('getFarmInfo ', { pbrPerBlock, poolInfo, pendingPbr, userInfo })
        const farmPoolObj = {};
        farmPoolObj[pairAddress] = {
            pendingPbr: pendingPbr,
            stakeData: userInfo,
            poolInfo: { ...poolInfo, pbrPerBlock },
        };

        dispatch({
            type: STAKE_LP_TOKENS,
            payload: farmPoolObj
        });

    } catch (error) {
        console.log('getFarmInfo', { error, pid, account, pairAddress })
    }
};



export const getLpBalanceFarm = (pairAddress, account, network) => async (dispatch) => {
    try {

        const _pairContract = pairContract(pairAddress, network);

        const balWei = await _pairContract.methods.balanceOf(account).call();

        const balObject = {};
        balObject[pairAddress] = balWei;

        dispatch({
            type: GET_LP_BALANCE_FARM,
            payload: balObject
        });

    } catch (error) {
        console.log('getLpBalanceFarm ', error)
    }
};


export const harvestReward = () => async (dispatch) => {
    try {
        //todo
    } catch (error) {
        console.log('harvestReward', error)
    }
};