import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useState } from "react";
import CustomButton from "../../Buttons/CustomButton";
import AddIcon from "@material-ui/icons/Add";
import AddCard from "./AddCard";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 200,
  },
  addButton: {
    width: 150,
  },
}));

const AddLiquidity = ({ account: { balance, loading } }) => {
  const classes = useStyles();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      {!showAdd ? (
        <div className={classes.root}>
          <CustomButton
            variant="light"
            onClick={() => setShowAdd(true)}
            className={classes.addButton}
          >
            <AddIcon /> Add liquidity
          </CustomButton>
        </div>
      ) : (
        <AddCard handleBack={() => setShowAdd(false)} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(AddLiquidity);
