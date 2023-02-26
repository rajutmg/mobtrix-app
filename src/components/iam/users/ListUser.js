import React, { Fragment, useState, useContext, createRef } from "react";
import { UserContext } from "../../../context/UserContext";
import { PermissionContext } from "../../../context/PermissionContext";
import { Link, useHistory } from "react-router-dom";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import TableActionControl from "../../../utils/TableActionControl";
import axios from "axios";

import MaterialTable, { MTableToolbar } from "material-table";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const ListUser = () => {
  const url = `${localStorage.api}/user`;

  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const history = useHistory();
  const tableRef = createRef();
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const pageSize = parseInt(process.env.REACT_APP_paginateSize);

  let filterurl = "";
  let filter = {
    name: "",
    status: "",
    role: "",
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getUsers = async (urlPaginate) => {
    const res = await axios.get(urlPaginate, headers);
    if (res.data.status === "fail") {
      setMessage(res.data.message);
      return false;
    }

    // paginated results from backend : data.data
    return {
      data: res.data.data.data,
      page: res.data.data.current_page - 1,
      totalCount: res.data.data.total,
    };
  };

  const deleteClient = async (id) => {
    let res = await axios.delete(url + "/" + id, headers);
    setToast(res.data.message);
  };

  const setFilterQuery = (e) => {
    let key = e.target.name;
    filter[key] = e.target.value;
  };

  const filterClient = async (e) => {
    if (e.keyCode !== 13 && e.which !== 13) {
      return false;
    }
    filterurl="";
    for (const key in filter) {
      if (filter[key] !== "") {
        filterurl += `&${key}=${filter[key]}`;
      }
    }
    
    // refresh the material table
    tableRef.current && tableRef.current.onQueryChange();
  };

  const columns = [
    {
      title: "User Info",
      field: "username",
      filterComponent: () => (
        <TextField
          name="name"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
      render: (rowData) => (
        <div>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Avatar alt={rowData.username} src={rowData.avatar} />
            </Grid>
            <Grid item xs={6}>
              <Link to={`/iam/users/${rowData.id}`} className="linkStyle">
                {rowData.username}
              </Link>
              <div>{rowData.email}</div>
            </Grid>
          </Grid>
        </div>
      ),
    },
    {
      title: "Status",
      field: "is_verified",
      filterComponent: () => (
        <FormControl size="small" fullWidth>
        <Select
          labelId="demo-simple-select-label"
          name="status"
          variant="outlined"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        >
          <MenuItem value="">&#10240;</MenuItem>
          <MenuItem value={1}>Verified</MenuItem>
          <MenuItem value={0}>Not Verified</MenuItem>
        </Select>
      </FormControl>
      ),
      render: (rowData) => (
        <span>
          {rowData.is_verified === 1 ? (
            <div>
              <VerifiedUserIcon style={{ color: "#4caf50" }} />{" "}
              <span style={{ verticalAlign: "super" }}>Verified</span>
              <div>{new Date(rowData.email_verified_at).toDateString()}</div>
            </div>
          ) : (
            "Not Verified"
          )}
        </span>
      ),
    },
    {
      title: "Role",
      field: "role",
      filterComponent: () => (
        <TextField
          name="role"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
    },
  ];

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <Fragment>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <MaterialTable
        title="Users"
        columns={columns}
        tableRef={tableRef}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${
            query.pageSize
          }`;

          if (filterurl !== "") {
            urlPaginate = `${urlPaginate}${filterurl}`
          }
          return await getUsers(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit User",
            hidden: TableActionControl("user update", permission),
            onClick: (event, rowData) =>
              history.push(`/iam/users/edit/${rowData.id}`),
          },
        ]}
        editable={{
          isDeletable: rowData => !TableActionControl("user delete", permission),
          isDeleteHidden: rowData => TableActionControl("user delete", permission),
          onRowDelete: async (oldData) =>{
            await deleteClient(oldData.id);
          }
        }}
        options={{
          actionsColumnIndex: -1,
          search: false,
          pageSize: pageSize,
          filtering: true,
          exportButton: { csv: true },
          exportCsv: (columns, data) => {
          let token = `token=${user.access_token}`
          let exportUrl = `${localStorage.api}/exportUser?${token}${filterurl}`
          window.open(exportUrl, '_blank');
        }
        }}
      />
    </Fragment>
  );
};

export default ListUser;
