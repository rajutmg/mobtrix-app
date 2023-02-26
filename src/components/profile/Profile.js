import React from "react";
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  Redirect,
  useLocation,
} from "react-router-dom";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import UserInfo from "./UserInfo";
import NamecheapUser from "./NamecheapUser";

const Profile = () => {
  const match = useRouteMatch();
  const { pathname } = useLocation();

  return (
    <Card>
      <CardContent>
        {/*Button links*/}
        <div className="mb-4">
          <Link to="/profile/me" className="tdnone">
            <Button
              variant="contained"
              className="mr-3"
              color={pathname.includes("/me") ? "primary" : "default"}
            >
              User Info
            </Button>
          </Link>

          <Link to="/profile/namecheap" className="tdnone">
            <Button
              variant="contained"
              className="mr-3"
              color={pathname.includes("namecheap") ? "primary" : "default"}
            >
              Namecheap Config
            </Button>
          </Link>
        </div>

        <Switch>
          <Route exact path={`${match.path}/me`} component={UserInfo} />
          <Route
            exact
            path={`${match.path}/namecheap`}
            component={NamecheapUser}
          />
          <Redirect to={`${match.path}/me`} />
        </Switch>
      </CardContent>
    </Card>
  );
};

export default Profile;
