import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const Role = () => {
  useEffect(() => {
    getPermissions();
    // eslint-disable-next-line
  }, []);

  const url = `${localStorage.api}/permission`;
  const [user] = useContext(UserContext);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPermissions = async () => {
    let headers = {
      headers: { Authorization: `${user.token_type} ${user.access_token}` },
    };
    let res = await axios.get(url, headers).catch(error =>{return error.response});
    if (res.data.status === "Fail") {
      setError(res.data.message);
      setLoading(false)
      return false;
    }
    
    setPermissions(res.data.data);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading ...</div>;
  }


  if (error) {
    return <p>{error}</p>
  }

  return (
    <Table className="" size="small" aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Role Name</TableCell>
          <TableCell align="left">Created at</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {permissions.map((item) => (
          <TableRow key={item.id}>
            <TableCell component="th" scope="row">
              <div>{item.name}</div>
            </TableCell>

            <TableCell align="left">{new Date(item.created_at).toDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Role;
