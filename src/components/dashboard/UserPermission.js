import React, { useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { PermissionContext } from "../../context/PermissionContext";
import axios from "axios";

const UserPermission = () => {
  const [user] = useContext(UserContext);
  const [, setPermission] = useContext(PermissionContext);

  useEffect(() => {
    getUserPermission();
    // eslint-disable-next-line
  }, []);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getUserPermission = async () => {
    const permURL = `${localStorage.api}/userpermissions`;
    let res = await axios.post(permURL, { user_id: user.user.id }, headers);
    if (res.data.status === "fail") {
      return false;
    }
    setPermission(res.data.data);
  };

  return <div>Begin</div>;
};

export default UserPermission;
