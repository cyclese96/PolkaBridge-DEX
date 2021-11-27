import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useState } from "react";

import TabPage from "../../TabPage";
import tokenThumbnail from "../../../utils/tokenThumbnail";
import Farm from "./Farm";

const useStyles = makeStyles((theme) => ({
}));

const Farms = ({ account: { balance, loading } }) => {
    const classes = useStyles();
    const [showCard, setShowAdd] = useState({ status: false, component: "" });

    return (
        <>
            <div className="mb-3">
                <TabPage data={1} />
            </div>
            <Farm />
        </>
    );
};

const mapStateToProps = (state) => ({
    account: state.account,
});

export default connect(mapStateToProps, {})(Farms);
