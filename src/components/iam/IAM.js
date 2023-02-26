import React, { Fragment, useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, Switch, Route, useLocation, useHistory} from "react-router-dom";
import User from "./users/User";
import ShowUser from "./users/ShowUser";
import EditUser from "./users/EditUser";
import Role from "./roles/Role";
import ShowRole from "./roles/ShowRole";
import Permission from "./permissions/Permission";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

const routes = [
  {
    path: "/iam",
    exact: true,
    main: () => <User />,
  },
  {
    path: "/iam/users",
    exact: true,
    main: () => <User />,
  },
  {
    path: "/iam/users/:id",
    exact: true,
    main: () => <ShowUser />,
  },
  {
    path: "/iam/users/edit/:id",
    exact: true,
    main: () => <EditUser />,
  },
  {
    path: "/iam/roles",
    exact: true,
    main: () => <Role />,
  },
   {
    path: "/iam/roles/:id",
    exact: true,
    main: () => <ShowRole />,
  },
  {
    path: "/iam/permissions",
    exact: true,
    main: () => <Permission/>,
  },
];

const IAM = () => {
  const [tabView, setTabView] = useState("users");
  const [user] = useContext(UserContext);
  const location = useLocation();
  const history = useHistory();


  useEffect(() => {
    // Allow only Super Admin, Admin to access page 
    if (!['Super Admin', 'Admin'].includes(user.role)) {
      history.push('/dashboard');
      return false;
    }
    getDefaultTab();
    // eslint-disable-next-line
  }, [])

  const onChangeTab = (tab) => {
    setTabView(tab);
  };

  const getDefaultTab = () =>{
    let path = location.pathname;
    if (path.includes('users')) {
      setTabView('users');
    } else if (path.includes('roles')){
      setTabView('roles')
    }else if (path.includes('permissions')){
      setTabView('permissions');
    }else{
      setTabView('users');
    }
  }

  return (
    <Fragment>
      <Card>
        <CardContent>
          <div className="mb-3">
            <Link to="/iam/users" className="tdnone">
              <Button
                variant="contained"
                color={tabView === "users" ? "primary" : "default"}
                className="mr-3 active"
                onClick={()=>onChangeTab('users')}
              >
                Users
              </Button>
            </Link>
            <Link to="/iam/roles" className="tdnone">
              <Button
                variant="contained"
                color={tabView === "roles" ? "primary" : "default"}
                className="mr-3"
                onClick={()=>onChangeTab('roles')}
              >
                Roles{" "}
              </Button>
            </Link>
            <Link to="/iam/permissions" className="tdnone">
              <Button
                variant="contained"
                color={tabView === "permission" ? "primary" : "default"}
                className="mr-3"
                onClick={()=>onChangeTab('permission')}
              >
                Permissions{" "}
              </Button>
            </Link>
          </div>

          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                children={<route.main />}
              />
            ))}
          </Switch>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default IAM;
