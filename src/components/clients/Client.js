import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import AddClient from "./AddClient";
import ListClient from "./ListClient";
import ShowClient from "./ShowClient";
import EditClient from "./EditClient";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const routes = [
  {
    path: "/client/create",
    exact: true,
    main: () => <AddClient />,
  },
  {
    path: "/client",
    exact: true,
    main: () => <ListClient />,
  },
  {
    path: "/client/:id",
    exact: true,
    main: () => <ShowClient />,
  },
  {
    path: "/client/edit/:id",
    exact: true,
    main: () => <EditClient />,
  },
];

const Client = () => {
  return (
    <Fragment>
      <Card>
        <CardContent>
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

export default Client;
