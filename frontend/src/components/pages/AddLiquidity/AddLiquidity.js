import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useState } from "react";
import CustomButton from "../../Buttons/CustomButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import AddCard from "./AddCard";
import RemoveCard from "./RemoveCard";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 200,
    display: "flex",
    flexWrap: "wrap",
  },
  addButton: {
    width: 170,
  },
}));

const AddLiquidity = ({ account: { balance, loading } }) => {
  const classes = useStyles();
  const [showCard, setShowAdd] = useState({ status: false, component: "" });

  return (
    <>
      {!showCard.status ? (
        <div className={classes.root}>
          <CustomButton
            variant="light"
            onClick={() => setShowAdd({ status: true, component: "AddCard" })}
            className={classes.addButton}
          >
            <AddIcon /> Add liquidity
          </CustomButton>
          <CustomButton
            variant="light"
            onClick={() =>
              setShowAdd({ status: true, component: "RemoveCard" })
            }
            className={classes.addButton}
          >
            <RemoveIcon /> Remove liquidity
          </CustomButton>
        </div>
      ) : showCard.component === "AddCard" ? (
        <AddCard
          handleBack={() => setShowAdd({ status: false, component: "" })}
        />
      ) : (
        <RemoveCard
          handleBack={() => setShowAdd({ status: false, component: "" })}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(AddLiquidity);
