import React from "react";
import { Switch, Route, Link, useRouteMatch, Redirect, useLocation } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
// For Namecheap
import ListDomain from "./ListDomain";
import SearchDomain from "./SearchDomain";
import ShowDomain from "./domains/ShowDomain";
import AccessControl from "../../utils/AccessControl";
// For Local domain
import DomainEdit from "./domains/DomainEdit";
import DomainCreate from "./domains/DomainCreate";
import DomainList from "./domains/DomainList";
import DomainShow from "./domains/DomainShow";
const Namecheap = () => {
  const match = useRouteMatch();
  const { pathname } = useLocation();

  return (
    <Card>
      <CardContent>
        {/*Links to redirect to namecheap pages*/}
        <div className="mb-3">
          <Link to={`${match.url}/domains`} className="tdnone">
            <Button
              variant="contained"
              className="mr-3"
              color={pathname.includes("domains") ? "primary" : "default"}
            >
              List Domains
            </Button>
          </Link>

          <AccessControl hasAccess="namecheap read">
            <Link to={`${match.url}/list`} className="tdnone">
              <Button
                variant="contained"
                className="mr-3 active"
                color={pathname.includes("list") ? "primary" : "default"}
              >
                Namecheap Domains
              </Button>
            </Link>
          </AccessControl>

          <AccessControl hasAccess="namecheap create">
            <Link to={`${match.url}/search`} className="tdnone">
              <Button
                variant="contained"
                className="mr-3"
                color={pathname.includes("search") ? "primary" : "default"}
              >
                Search Domains
              </Button>
            </Link>
          </AccessControl>
        </div>

        <Switch>
          <Route exact path={`${match.url}/domains`} component={DomainList} />
          <Route exact path={`${match.url}/domains/create`} component={DomainCreate} />
          <Route exact path={`${match.url}/domains/edit/:id`} component={DomainEdit} />
          <Route exact path={`${match.url}/domains/show/:id`} component={DomainShow} />
          {/*Namecheap api domains*/}
          <Route exact path={`${match.url}/list`} component={ListDomain} />
          <Route exact path={`${match.url}/search`} component={SearchDomain} />
          <Route exact path={`${match.url}/domain/:domain`} component={ShowDomain} />
          <Redirect to={`${match.url}/domains`} />
        </Switch>
      </CardContent>
    </Card>
  );
};

export default Namecheap;
