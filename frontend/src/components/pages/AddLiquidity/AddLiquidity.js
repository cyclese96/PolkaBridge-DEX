import { Button, Card, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import AddCard from "./AddCard";
import RemoveCard from "./RemoveCard";
import TabPage from "../../TabPage";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 500,
    maxWidth: 500,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
    backgroundColor: theme.palette.primary.bgCard,
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
    color: theme.palette.primary.iconColor,

    fontSize: 24,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  button: {
    backgroundColor: theme.palette.primary.iconBack,
    color: theme.palette.primary.iconColor,
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
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
      height: 50,
      width: 240,
      padding: "15px 30px 15px 30px",
    },
  },
  heading: {
    color: theme.palette.primary.iconColor,
  },
}));

const AddLiquidity = ({ account: { loading } }) => {
  const classes = useStyles();
  const [showCard, setShowAdd] = useState({ status: false, component: "" });
  const query = new URLSearchParams(useLocation().search);

  const action = query.get("action");
  useEffect(() => {
    if (action === "add_liquidity") {
      setShowAdd({ status: true, component: "AddCard" });
    } else if (action === "remove_liquidity") {
      setShowAdd({ status: true, component: "RemoveCard" });
    }
  }, [action]);

  return (
    <>
      <div className="mb-3">
        <TabPage data={1} />
      </div>

      {!showCard.status ? (
        <div>
          <Card elevation={10} className={classes.card}>
            <h4 className={classes.heading}>Pools</h4>

            <div className={classes.buttonsWrapper}>
              <Button
                className={classes.button}
                onClick={() =>
                  setShowAdd({ status: true, component: "AddCard" })
                }
              >
                <AddIcon className={classes.icon} /> Add liquidity
              </Button>
              <Button
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
