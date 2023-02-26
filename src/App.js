import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { UserContext } from "./context/UserContext";
import Sidebar from "./layouts/appbar/Sidebar";
import NavUserMenu from "./layouts/appbar/NavUserMenu";
import Search from "./layouts/appbar/Search";
import Dashboard from "./components/dashboard/Dashboard";
import SearchResult from "./components/dashboard/SearchResult";
import UserPermission from "./components/dashboard/UserPermission";
import Login from "./components/auth/Login";
import Oauth from "./components/auth/Oauth";
// import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import SetPassword from "./components/auth/SetPassword";
import Client from "./components/clients/Client";
import Project from "./components/project/Project";
import CampaignIndex from "./components/cam/CampaignIndex";
import Namecheap from "./components/namecheap/Namecheap";
import IAM from "./components/iam/IAM";
import Profile from "./components/profile/Profile";
import "./App.css";

import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

function App() {
  // constructor [update the value of url for dev/prod]
  useEffect(() => {
    readLocalStorageData();
    localStorage.setItem("api", process.env.REACT_APP_API_URL);
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [user, setUser] = useContext(UserContext);

  const classes = useStyles();
  const theme = useTheme();

  /*Sidebar toggle function*/
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  /*Sidebar toggle end*/

  // check token expiration
  const checkIfTokenExpirted = (res) =>{
    let time = new Date();
    let expiry_time = new Date(Date.parse(res.expiry_time));
    if (time > expiry_time) {
      logOutUser();
      return  true;
    }
    return false;
  }

  // Logout user
  const logOutUser = () => {
    // empty local storage
    setUser(null);
    localStorage.removeItem("mobtrix_data");
  };

  // Check Authentication
  const readLocalStorageData = () => {
    let res = JSON.parse(localStorage.getItem("mobtrix_data"));
    if (res === null) {
      return false;
    }
    let status = checkIfTokenExpirted(res);
    if (status) {
      console.log("token expired");
      return false;
    }
    setUser(res);
  
  };

  if (loading) {
    return (
      <div className="loadingStyle">
        <CircularProgress style={{ marginTop: "10%" }} />
      </div>
    );
  }

  if (user === null || !user || user === undefined) {
    return (
      <div>
        <Router>
          <Switch>
            {/*<Route exact path="/register" component={Register} />*/}
            <Route exact path="/oauth2/:token/:email" component={Oauth} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password/:token" component={SetPassword} />
            <Route exact path="/login" component={Login} />
            <Route path="/" render={() => <Redirect to="/login"></Redirect>} />
          </Switch>
        </Router>
        {/*<Login />*/}
      </div>
    );
  }

  return (
    <Router>
    <UserPermission/>
      <div className={classes.root}>
        <CssBaseline />

        {/* Navigation bar begin*/}
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Mobtrix
            </Typography>
            <Search/>

            {/*Authenticated user info*/}
            <NavUserMenu user={user.user} logOutUser={logOutUser} />
            {/*Authenticated user info end*/}
          </Toolbar>
        </AppBar>
        {/* Navigation bar End*/}

        {/*Sidebar begins*/}
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <Typography
              variant="h6"
              noWrap
              style={{ marginRight: "auto", paddingLeft: "20px" }}
            >
              Menu
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />

          {/* Seperate into sidebar components */}
          <Sidebar />
        </Drawer>
        {/*Sidebar ends*/}

        {/*body area*/}
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/search/:value" component={SearchResult} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route
              exact
              path="/login"
              render={() =>
                user !== undefined ? (
                  <Redirect to="/"></Redirect>
                ) : (
                  <Login> </Login>
                )
              }
            />
            <Route path="/profile" component={Profile} />
            <Route path="/client" component={Client} />
            <Route path="/project" component={Project} />
            <Route path="/cam" component={CampaignIndex} />
            <Route path="/namecheap" component={Namecheap} />
            <Route path="/iam" component={IAM} />
          </Switch>
        </main>
        {/*body area Ends*/}
      </div>
    </Router>
  );
}

// styles
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default App;
