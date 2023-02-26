import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from "react-router-dom";

import List from './List';
import Import from './Import';
import Edit from './Edit';
import Show from './Show';
import Add from './Add';
import AddValues from './AddValues';
import EditValues from './EditValues';

const Settings = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${match.url}/add`} component={Add}/>
      <Route exact path={`${match.url}/list`} component={List}/>
      <Route exact path={`${match.url}/import/:id`} component={Import}/>
      <Route exact path={`${match.url}/addvalues/:id`} component={AddValues}/>
      <Route exact path={`${match.url}/edit/:id`} component={Edit}/>
      <Route exact path={`${match.url}/editvalues/:id`} component={EditValues}/>
      <Route exact path={`${match.url}/show/:id`} component={Show}/>
      <Redirect to={`${match.url}/list`} />
    </Switch>
  );
};

export default Settings;
