import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import AddProject from "./AddProject";
import ListProject from "./ListProject";
import EditProject from "./EditProject";
import ShowProject from "./ShowProject";
import Loader from '../../layouts/feedback/Loader';

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const routes = [
  {
    path: "/project/create",
    exact: true,
    main: () => <AddProject />,
  },
  {
    path: "/project",
    exact: true,
    main: () => <ListProject />,
  },
  {
    path: "/project/edit/:id",
    exact: true,
    main: () => <EditProject />,
  },
  {
    path: "/project/:id",
    exact: true,
    main: () => <ShowProject />,
  },
];

export default function Project() {
  useEffect(() => {
    setLoading(false);
  }, []);

  const [loading, setLoading] = useState(true);
  if (loading) {
    return <Loader />;
  }

  return (
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
  );
}
