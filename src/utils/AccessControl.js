import React, { Fragment, useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { PermissionContext } from "../context/PermissionContext";

const AccessControl = ({ children, hasAccess, checkID }) => {
  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const [show, setShow] = useState(false);
  useEffect(() => {
    checkUserAccess();
    // eslint-disable-next-line
  }, [permission]);
  // console.log(`hasaccess: ${hasAccess} , show: ${show}`);
  const checkUserAccess = () => {
    if (permission.role === "Super Admin" || permission.role === "Admin") {
      setShow(true);
    }
    if (checkID === user.user.id && permission.permissions.includes(hasAccess)) {
      setShow(true);
    }

    if (checkID === undefined && permission.permissions.includes(hasAccess)) {
      setShow(true);
    }
  };

  return <Fragment>{show ? children : ""}</Fragment>;
};

export default AccessControl;
