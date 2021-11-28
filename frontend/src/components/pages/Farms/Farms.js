import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useState } from "react";

import TabPage from "../../TabPage";
import Farm from "./Farm";

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
}));

const Farms = ({ account: { balance, loading } }) => {
    const classes = useStyles();
    const [showCard, setShowAdd] = useState({ status: false, component: "" });

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
                    Stake LP tokens to earn.
                </div>
            </div>


            <div className="container row">

                <div className="d-flex flex-wrap justify-content-around align-items-center">
                    <div className="col-md-4">
                        <Farm />
                    </div>
                    <div className="col-md-4">
                        <Farm />
                    </div>
                    <div className="col-md-4">
                        <Farm />
                    </div>

                </div>
            </div>



        </>
    );
};

const mapStateToProps = (state) => ({
    account: state.account,
});

export default connect(mapStateToProps, {})(Farms);
