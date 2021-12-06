import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useEffect, useState } from "react";

import TabPage from "../../TabPage";
import Farm from "./Farm";
import { supportedFarmingPools } from "../../../constants";
import StakeDialog from "./StakeDialog";
import store from "../../../store";
import { START_TRANSACTION } from "../../../actions/types";

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: "center",
        color: "#bdbdbd",
        fontSize: 36,
        fontWeight: 600,
    },
    subTitle: {
        textAlign: "center",
        color: "#bdbdbd",
        fontSize: 24,
        fontWeight: 600,
    },
    card: {
        [theme.breakpoints.down("md")]: {
            display: "flex",
            justifyContent: "space-around",
            paddingRight: 65,
            [theme.breakpoints.down("sm")]: {
                paddingLeft: 15,
            },
        },
    }
}));

const Farms = (props) => {

    const {
        account: { balance, loading, currentNetwork },
        dex: { transaction },
        farm: { }
    } = props;

    const classes = useStyles();
    const [stakeDialog, setStakeDialog] = useState({ open: false, type: 'stake', farmPool: null });


    const handleStake = (type, pool) => {
        setStakeDialog({ type: type, farmPool: pool, open: true })
    }

    // swap status updates
    useEffect(() => {
        if (!transaction.hash && !transaction.type) {
            return;
        }

        if (
            transaction.type === "approve" || transaction.type === "stake" &&
            !stakeDialog.open
        ) {
            setStakeDialog({ type: null, farmPool: null, open: true })
        }
    }, [transaction]);

    const handleDialogClose = () => {
        setStakeDialog(false)
        setTimeout(() => {
            store.dispatch({ type: START_TRANSACTION });
        }, 200)

    }



    return (
        <>
            <div>
                <TabPage data={2} />
            </div>
            <div className="mt-5 mb-2 container row">
                {/* <div className={classes.title}>
                    Farms
                </div> */}
                <div className={classes.subTitle}>
                    {!supportedFarmingPools?.[currentNetwork] ? "No Farming pools available on " + currentNetwork + " network" : "Stake LP tokens to earn."}

                </div>
            </div>
            <div className="container row">
                <div className="d-flex flex-wrap justify-content-around align-items-center">
                    {supportedFarmingPools?.[currentNetwork]?.map(farmPool => {
                        return <div className="col-md-4">
                            <Farm farmPool={farmPool} onStake={handleStake} />
                        </div>
                    })}
                </div>
                <div>
                    <StakeDialog open={stakeDialog.open} farmPool={stakeDialog.farmPool} handleClose={handleDialogClose} />
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    account: state.account,
    dex: state.dex,
    farm: state.farm
});

export default connect(mapStateToProps, {})(Farms);
