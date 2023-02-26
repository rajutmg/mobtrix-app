import React from "react";
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  Redirect,
  useLocation,
} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

import Campaign from "./campaign/Campaign";
import Settings from "./settings/Settings";
import Payouts from "./payouts/Payouts";
import Traffic from "./traffic/Traffic";
import Translation from './translation/Translation';
import Operators from './operators/Operators';

const CampaignIndex = () => {
  const match = useRouteMatch();
  const { pathname } = useLocation();

  return (
    <Card>
      <CardContent>
        {/*Links to redirect to CampaignIndex pages*/}
        <div className="mb-3">
          <Link to={`${match.url}/list`} className="tdnone">
            <Button
              size="small"
              variant="contained"
              className="mr-3 active"
              color={pathname.includes("campaign") ? "primary" : "default"}
            >
              Campaigns
            </Button>
          </Link>

          <Link to={`${match.url}/payouts/list`} className="tdnone">
            <Button
              size="small"
              variant="contained"
              className="mr-3"
              color={pathname.includes("payouts") ? "primary" : "default"}
            >
              Payouts
            </Button>
          </Link>

          <Link to={`${match.url}/settings`} className="tdnone">
            <Button
              size="small"
              variant="contained"
              className="mr-3"
              color={pathname.includes("settings") ? "primary" : "default"}
            >
              Settings
            </Button>
          </Link>

          <Link to={`${match.url}/translation`} className="tdnone">
            <Button
              size="small"
              variant="contained"
              className="mr-3"
              color={pathname.includes("translation") ? "primary" : "default"}
            >
              Translation
            </Button>
          </Link>

          <Link to={`${match.url}/traffic/list`} className="tdnone">
            <Button
              size="small"
              variant="contained"
              className="mr-3"
              color={pathname.includes("traffic") ? "primary" : "default"}
            >
              Traffic Source
            </Button>
          </Link>

          <Link to={`${match.url}/operators/list`} className="tdnone">
            <Button
              size="small"
              variant="contained"
              className="mr-3"
              color={pathname.includes("operators") ? "primary" : "default"}
            >
              Operators
            </Button>
          </Link>

        </div>

        <Switch>
          <Route path={`${match.url}/campaign`} component={Campaign} />
          <Route path={`${match.url}/settings`} component={Settings} />
          <Route path={`${match.url}/payouts`} component={Payouts} />
          <Route path={`${match.url}/traffic`} component={Traffic} />
          <Route path={`${match.url}/operators`} component={Operators} />
          <Route path={`${match.url}/translation`} component={Translation} />
          <Redirect to={`${match.url}/campaign`} />
        </Switch>
      </CardContent>
    </Card>
  );
};

export default CampaignIndex;
