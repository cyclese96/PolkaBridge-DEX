import { Button, Card, makeStyles } from "@material-ui/core";
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
  },
  addButton: {
    width: 170,
  },
  card: {
    width: 500,
    height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      width: "100%",
    },
  },
  buttonsWrapper: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#f6f6f6",
    fontSize: 24,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#f6f6f6",
    borderColor: "#f6f6f6",

    height: 40,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 11,
      padding: "5px 20px 5px 5px",
    },
  },
}));

const AddLiquidity = ({ account: { balance, loading } }) => {
  const classes = useStyles();
  const [showCard, setShowAdd] = useState({ status: false, component: "" });

  return (
    <>
      {!showCard.status ? (
        <Card className={classes.card}>
          <h4>Pools</h4>

          <div className={classes.buttonsWrapper}>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => setShowAdd({ status: true, component: "AddCard" })}
            >
              <AddIcon className={classes.icon} /> Add liquidity
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() =>
                setShowAdd({ status: true, component: "RemoveCard" })
              }
            >
              <RemoveIcon className={classes.icon} /> Remove liquidity
            </Button>
          </div>
        </Card>
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
