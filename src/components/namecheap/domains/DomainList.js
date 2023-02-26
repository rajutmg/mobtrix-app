import React, { Fragment, useState, useContext, createRef } from "react";
import { UserContext } from "../../../context/UserContext";
import { PermissionContext } from "../../../context/PermissionContext";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AccessControl from "../../../utils/AccessControl";
import TableActionControl from "../../../utils/TableActionControl";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";

import MaterialTable, { MTableToolbar } from "material-table";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const DomainList = () => {
  const url = `${localStorage.api}/domains`;
  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const history = useHistory();
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const pageSize = parseInt(process.env.REACT_APP_paginateSize);
  const tableRef = createRef();

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  let filterurl = "";
  let filter = {
    domain: "",
    user: "",
    source: "",
    blacklisted: "",
  };

  const setFilterQuery = (e) => {
    let key = e.target.name;
    filter[key] = e.target.value;
    // console.log(filter);
  };

  const filterClient = async (e) => {
    if (e.keyCode !== 13 && e.which !== 13) {
      return false;
    }
    filterurl = "";
    for (const key in filter) {
      if (filter[key] !== "") {
        filterurl += `&${key}=${filter[key]}`;
      }
    }

    // console.log(filterurl);

    // refresh the material table
    tableRef.current && tableRef.current.onQueryChange();
  };
  const columns = [
    {
      title: "Domain",
      field: "domain",
      filterComponent: () => (
        <TextField
          name="domain"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
      render: (rowData) => (
        <Link to={`/namecheap/domains/show/${rowData.id}`}>{rowData.domain}</Link>
      )
    },
    {
      title: "Source",
      field: "source",
      filterComponent: () => (
        <TextField
          name="source"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
    },
    {
      title: "Owner",
      field: "user",
      filterComponent: () => (
        <TextField
          name="user"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
    },
    {
      title: "Blacklisted",
      field: "blacklisted",
      filterComponent: () => (
        <FormControl size="small" fullWidth>
          <Select
            labelId="demo-simple-select-label"
            name="blacklisted"
            variant="outlined"
            onChange={setFilterQuery}
            onKeyPress={filterClient}
          >
            <MenuItem value="">&#10240;</MenuItem>
            <MenuItem value={1}>Yes</MenuItem>
            <MenuItem value={0}>No</MenuItem>
          </Select>
        </FormControl>
      ),
      render: (rowData) => <span>{rowData.blacklisted === 1 ? "Yes" : "No"}</span>,
    },
    {
      title: "Created At",
      field: "created_at",
      filterComponent: () => (
        <TextField
          name="created_at"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
      render: (rowData) => <span>{new Date(rowData.created_at).toLocaleDateString()}</span>,
    },
  ];

  const getDomain = async (urlPaginate) => {
    let res = await axios.get(urlPaginate, headers);
    // console.log(res.data);
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

  const deleteDomain = async (id) => {
    let data = await axios.delete(url + "/" + id, headers);
    setToast(data.data.message);
  };

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <Fragment>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <MaterialTable
        title="Domain List"
        tableRef={tableRef}
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${query.pageSize}`;
          if (filterurl !== "") {
            urlPaginate = `${urlPaginate}${filterurl}`;
          }
          return await getDomain(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px", marginBottom: "5px" }}>
                <AccessControl hasAccess="domain create" checkID={user.user.id}>
                  <Link to="/namecheap/domains/create" className="tdnone">
                    <Button variant="contained" size="small">
                      add domain
                    </Button>
                  </Link>
                </AccessControl>
              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Domain",
            hidden: TableActionControl("domain update", permission),
            onClick: (event, rowData) => history.push(`/namecheap/domains/edit/${rowData.id}`),
          },
        ]}
        editable={{
          isDeletable: (rowData) => !TableActionControl("domain delete", permission),
          isDeleteHidden: (rowData) => TableActionControl("domain delete", permission),
          onRowDelete: async (oldData) => {
            await deleteDomain(oldData.id);
          },
        }}
        options={{
          actionsColumnIndex: -1,
          search: false,
          pageSize: pageSize,
          exportButton: {csv:true},
          filtering: true,
        }}
      />
    </Fragment>
  );
};

export default DomainList;
