import React, { Fragment, useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";
import AddRole from "./AddRole";
import DeleteModal from "../../../layouts/modal/DeleteModal";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import AccessControl from "../../../utils/AccessControl";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const Role = () => {
  useEffect(() => {
    getRoles();

    // eslint-disable-next-line
  }, []);

  const url = `${localStorage.api}/role`;
  const [user] = useContext(UserContext);
  const [roles, setRoles] = useState([]);
  const [item, setItem] = useState("");
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getRoles = async () => {
    let res = await axios.get(url, headers).catch((error) => {
      return error.response;
    });

    if (res.data.statusCode === 403) {
      setError(res.data.message);
      setLoading(false);
      return false;
    }

    setRoles(res.data.data);
    setLoading(false);
  };

  const deleteRole = async (id) => {
    let data = await axios.delete(url + "/" + id, headers);
    let res = [...roles.filter((role) => role.id !== id)];
    setRoles(res);
    setmodalIsOpen(false);
    setToast(data.data.message);
  };

  const getRoleID = (item) => {
    setItem(item);
    setmodalIsOpen(true);
  };

  if (loading) {
    return <div>Loading ... </div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Fragment>
      <AccessControl hasAccess="role create" checkID={user.user.id}>
        <AddRole roles={roles} setRoles={setRoles} />
      </AccessControl>
      <DeleteModal
        modalIsOpen={modalIsOpen}
        setmodalIsOpen={setmodalIsOpen}
        item={item}
        deleteItem={deleteRole}
      />
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <Table className="" size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Role Name</TableCell>
            <TableCell align="left">Created at</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell component="th" scope="row">
                <Link to={`/iam/roles/${role.id}`} style={{ color: "inherit" }}>
                  {role.name}
                </Link>
              </TableCell>

              <TableCell align="left">
                {new Date(role.created_at).toDateString()}
              </TableCell>

              {/*make super admin and admin not editable*/}
              <TableCell align="left">
                <AccessControl hasAccess="role update" checkID={user.user.id}>
                  <Link to={`/iam/roles/${role.id}`}>
                    <IconButton aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </Link>
                </AccessControl>

              {/* Dont aloow to delete below roles*/}
                {["Super Admin", "Admin", "User"].includes(role.name) ? (
                  ""
                ) : (
                  <AccessControl hasAccess="role delete" checkID={user.user.id}>
                    <IconButton
                      onClick={(e) => getRoleID(role)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </AccessControl>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
};

export default Role;
