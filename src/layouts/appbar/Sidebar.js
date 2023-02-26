import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { PermissionContext } from "../../context/PermissionContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import AssessmentIcon from "@material-ui/icons/Assessment";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import LanguageIcon from "@material-ui/icons/Language";
import FlagIcon from '@material-ui/icons/Flag';

const Sidebar = () => {
  const [permission] = useContext(PermissionContext);
  // link style to remove underline
  const textLink = {
    color: "inherit",
    textDecoration: "inherit",
  };

  return (
    <div>
      <List>
        <NavLink
          to="/dashboard"
          style={textLink}
          activeClassName="activeNavLinks"
        >
          <ListItem button key="Dashboard">
            <ListItemIcon>
              <HomeIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </NavLink>

        <NavLink to="/client" style={textLink} activeClassName="activeNavLinks">
          <ListItem button key="Client">
            <ListItemIcon>
              <AssignmentIndIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Client" />
          </ListItem>
        </NavLink>

        <NavLink
          to="/project"
          style={textLink}
          activeClassName="activeNavLinks"
        >
          <ListItem button key="Project">
            <ListItemIcon>
              <AssessmentIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Project" />
          </ListItem>
        </NavLink>

        <NavLink
          to="/cam"
          style={textLink}
          activeClassName="activeNavLinks"
        >
          <ListItem button key="Project">
            <ListItemIcon>
              <FlagIcon />{" "}
            </ListItemIcon>
            <ListItemText primary="Campaign" />
          </ListItem>
        </NavLink>

        {["Super Admin", "Admin"].includes(permission.role) ||
        permission.permissions.toString().includes("namecheap") ? (
          <NavLink
            to="/namecheap"
            style={textLink}
            activeClassName="activeNavLinks"
          >
            <ListItem button key="Namecheap">
              <ListItemIcon>
                <LanguageIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="Namecheap" />
            </ListItem>
          </NavLink>
        ) : (
          ""
        )}

        {["Super Admin", "Admin"].includes(permission.role) ? (
          <NavLink to="/iam" style={textLink} activeClassName="activeNavLinks">
            <ListItem button key="IAM">
              <ListItemIcon>
                <GroupIcon />{" "}
              </ListItemIcon>
              <ListItemText primary="IAM" />
            </ListItem>
          </NavLink>
        ) : (
          ""
        )}
      </List>

      {/*<Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>*/}
    </div>
  );
};

export default Sidebar;
