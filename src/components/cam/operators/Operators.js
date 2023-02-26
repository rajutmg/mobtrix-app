import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from "react-router-dom";

import List from './List';
import Add from './Add';
import Edit from './Edit';
import Import from './Import';
import View from './View';
import AddOperator from "./AddOperator";
import EditOperator from "./EditOperator";

const Operators = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${match.url}/list`} component={List} />
      <Route exact path={`${match.url}/create`} component={Add} />
      <Route exact path={`${match.url}/edit/:id`} component={Edit} />
      <Route exact path={`${match.url}/view/:id`} component={View} />
      <Route exact path={`${match.url}/Import`} component={Import}/>
      <Route exact path={`${match.url}/addoperator/:id`} component={AddOperator}/>
      <Route exact path={`${match.url}/editoperator/:id`} component={EditOperator}/>
      <Redirect to={`${match.url}/list`} />
    </Switch>
  );
};

export default Operators;
