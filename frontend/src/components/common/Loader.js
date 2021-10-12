import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    loader: {
        height: 150
    },
}));

const Loader = () => {
    const classes = useStyles();

    return <div><img src='https://thumbs.gfycat.com/LameDifferentBalloonfish-small.gif' className={classes.loader} /></div>;
};

export default Loader;
