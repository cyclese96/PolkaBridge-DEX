import { CircularProgress, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import pbrImg from "../../assets/balance.png";
import biteImg from "../../assets/bite.png";
import corgiImg from "../../assets/corgi.png";
import pwarImg from "../../assets/pwar.png";
import CustomButton from "../Buttons/CustomButton";
import { formatCurrency, fromWei, toWei } from "../../utils/helper";
import { connect } from "react-redux";
import {
  confirmAllowance,
  getUserStakedData,
} from "../../actions/stakeActions";
import { etheriumNetwork } from "../../constants";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    height: 300,
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: 300,
      height: 320,
    },
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
  },
  avatar: {
    // position: "relative",
    width: 35,
    height: "auto",
    // justifySelf: "start",
    marginLeft: 60,
  },
  cardHeading: {
    fontSize: 18,
    // alignSelf: "center",
    // justifySelf: "center",
  },
  cardText: {
    fontSize: 14,
    alignSelf: "start",
    marginLeft: 60,
    margin: 0,
  },
  buttons: {
    marginTop: 20,
    marginBottom: 20,
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  hint: {
    fontSize: 10,
    fontWeight: 400,
    color: "#919191",
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
  },
  bitePool: {
    marginBottom: 20,
    alignSelf: 'start',
  },
  poolItemText: {
    fontSize: 12,
    marginLeft: 60,
    margin: 0,
    marginTop:2
  },
  stakeButtons: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap-reverse' },
  stakeButton: {
    marginTop: 5,
    alignSelf: 'center',
    justifySelf: 'center'
  }
}));

const Staking = ({
  stake: { stake, pool, approved  },
  account: { currentAccount, currentNetwork, loading, error },
  tokenType,
  getUserStakedData,
  confirmAllowance,
  onStake,
  onUnstake,
  onClaim
}) => {
  const classes = useStyles();

  useEffect(async () => {

    getUserStakedData(tokenType, currentNetwork)

  }, [currentAccount, currentNetwork]);

  const handleApprove = async (tokenType) => {
    const tokenWeiAmountToApprove = currentNetwork === etheriumNetwork ? toWei("999999999") : "999999999999999999999999999999999999"
    await confirmAllowance(tokenWeiAmountToApprove, tokenType, currentNetwork);
    await getUserStakedData(tokenType, currentNetwork);
  };


  const currentAmount = (tokenType) => {
    return stake[tokenType] ? stake[tokenType].amount : 0
  }

  const tokenLogo = {
    'PBR': pbrImg,
    'BITE': biteImg,
    'CORGIB': corgiImg,
    'PWAR': pwarImg
  }

  const getCurrentApy = () => {
    if (tokenType === 'BITE'){
      return pool[tokenType].biteApy
    }else{
      return pool[tokenType].pwarApy
    }
    
  }

  return (
    <div className={classes.card}>
      <div className="card-theme">
        <div className={classes.cardContents}>
          { loading[tokenType]  ? (
            <div>
              <CircularProgress className={classes.numbers} />
            </div>
          ) : (
            <>
              <div className={classes.cardHeader}>
                <img
                  className={classes.avatar}
                  src={tokenLogo[tokenType]}
                />
                <small
                  style={{
                    color: "#f9f9f9",
                    marginTop: 8,
                    marginLeft: 5,
                    marginRight: 22,
                  }}
                >
                  {tokenType}
                </small>
                <h6 className={classes.cardHeading}>Staking Pool</h6>
              </div>

              {['BITE', 'PWAR'].includes(tokenType) ? (
                <div className={classes.bitePool}>
                  <p className={classes.poolItemText}>
                    <strong>{tokenType} APY: </strong>{" "}
                    {formatCurrency( getCurrentApy(), false, 1 , true )} %
                  </p>
                  <p className={classes.poolItemText}>
                    <strong>Total token staked:</strong>{" "}
                    {tokenType === 'PWAR' ?  formatCurrency(fromWei(pool[tokenType].totalTokenStaked), false, 1, true ) : formatCurrency(fromWei(pool[tokenType].totalTokenStaked)) } {tokenType}
                  </p>
                  {tokenType === 'PWAR' ? (
                    <p className={classes.poolItemText}>
                    <strong style={{marginTop:5}}>Total token claimed:</strong>{" "}
                    {formatCurrency(fromWei(pool[tokenType].totalTokenClaimed), false, 1, true )} {tokenType}
                  </p>
                  ) : ""}
                  
                </div>
              ) : ""}

              <>
                <p className={classes.cardText}>
                  <strong>Staked: </strong>{" "}
                  {tokenType === 'PWAR' ?  formatCurrency(fromWei(stake[tokenType].amount), false, 1, true ): formatCurrency(fromWei(stake[tokenType].amount)) } {tokenType}
                </p>
                <p className={classes.cardText}>
                  <strong>Claimed rewards: </strong>{" "}
                  {tokenType === 'PWAR' ? formatCurrency(fromWei(stake[tokenType].rewardClaimed), false, 1, true ) : formatCurrency(fromWei(stake[tokenType].rewardClaimed))}{" "}
                  {tokenType}
                </p>
                <p className={classes.cardText}>
                  <strong>Pending rewards: </strong>{" "}
                  {tokenType === 'PWAR' ? formatCurrency(fromWei(stake[tokenType].pendingReward), false, 1, true ) : formatCurrency(fromWei(stake[tokenType].pendingReward)) }{" "}
                  {tokenType}
                </p>
              </>



              <div className={classes.buttons}>
                {!approved[tokenType] ? (
                  <div>
                    <CustomButton onClick={() => handleApprove(tokenType)}>
                      Approve
                    </CustomButton>
                    <p className={classes.hint}>
                      ! Approve PBR tokens to start staking
                    </p>
                  </div>
                ) : (
                  <div className={classes.stakeButtons}>
                    <CustomButton disabled={currentAmount(tokenType) == 0} onClick={() => onClaim(tokenType)} >
                      Claim
                    </CustomButton>
                    <CustomButton onClick={() => onUnstake(tokenType)} variant="light">
                      Unstake
                    </CustomButton>
                    <CustomButton onClick={() => onStake(tokenType)}>Stake</CustomButton>
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  stake: state.stake,
  account: state.account,
});

export default connect(mapStateToProps, {
  getUserStakedData,
  confirmAllowance,
})(Staking);
