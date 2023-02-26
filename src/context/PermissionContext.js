import React, { useState, createContext } from "react";

export const PermissionContext = createContext();

export const PermissionProvider = (props) => {
  const [permission, setPermission] = useState({role:"", permissions:[]});

  return (
    <PermissionContext.Provider value={[permission, setPermission]}>
      {props.children}
    </PermissionContext.Provider>
  );
};
