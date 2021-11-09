import { Button, Card, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useState } from "react";
import CustomButton from "../../Buttons/CustomButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import AddCard from "./AddCard";
import RemoveCard from "./RemoveCard";
import TabPage from "../../TabPage";
import tokenThumbnail from "../../../utils/tokenThumbnail";
import { SwapHoriz } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 200,
  },
  addButton: {
    width: 170,
  },
  card: {
    width: 500,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,

      width: "90vw",
    },
  },
  buttonsWrapper: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
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
    height: 50,
    textTransform: "none",
    fontSize: 16,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: "20px 30px 20px 30px",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
      height: 50,
      width: 240,
      padding: "15px 30px 15px 30px",
    },
  },
  selectedToken: {
    color: "white",
    marginLeft: 5,
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  tokenIcon: {
    width: "auto",
    height: 22,
    marginRight: 2,
    borderRadius: "50%",
    color: "#e5e5e5",
  },
  token: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "black",
    border: "0.5px solid #616161",
    borderRadius: 12,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    height: 35,
    marginLeft: 10,
    marginRight: 10,
    cursor: "pointer",
    width: "fit-content",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
  },
  cardAddedLiquidity: {
    width: "100%",
    marginTop: 14,
    height: 70,
    display: "flex",
    border: "0.5px solid #313131",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,

    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      width: "100%",
    },
  },
  removeButton: {
    backgroundColor: "transparent",
    color: "white",
    width: 80,
    height: 40,
    border: "1px solid rgba(224, 7, 125, 0.9)",
    textTransform: "none",
    fontSize: 14,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      color: "white",
      width: "fit-content",
    },
  },
}));

const AddLiquidity = ({ account: { balance, loading } }) => {
  const classes = useStyles();
  const [showCard, setShowAdd] = useState({ status: false, component: "" });

  return (
    <>
      <div className="mb-3">
        <TabPage data={1} />
      </div>

      {!showCard.status ? (
        <div>
          <Card elevation={10} className={classes.card}>
            <h4>Pools</h4>

            <div className={classes.buttonsWrapper}>
              <Button
                variant="contained"
                className={classes.button}
                onClick={() =>
                  setShowAdd({ status: true, component: "AddCard" })
                }
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
