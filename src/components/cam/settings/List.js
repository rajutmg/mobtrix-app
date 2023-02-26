import React, { Fragment, useState, useContext,createRef } from "react";
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

const List = () => {
  const url = `${localStorage.api}/settings`;
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

    campaign_id: "",
    url: "",
    client_name: "",
    created_at:""
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
    filterurl="";
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
    { title: "Campaign ID", field: "campaign_id",
    filterComponent: () => (
      <TextField
        name="campaign_id"
        size="small"
        variant="outlined"
        autoComplete="off"
        onChange={setFilterQuery}
        onKeyPress={filterClient}
      />
    ),
    },
    {
      title: "URL",
      field: "url",
      filterComponent: () => (
        <TextField
          name="url"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
      render: (rowData) => (
        <a
          href={`http://${rowData.url}`}
          target="_blank"
          rel="noreferrer"
          style={linkTags}
        >
          {rowData.url}
        </a>
      ),
    },
    {
      title: "Client",
      field: "client_name",
      filterComponent: () => (
        <TextField
          name="client_name"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
    },
    
  ];

  const getSettings = async (urlPaginate) => {
    let res = await axios.get(urlPaginate, headers);
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

  const deleteSettings = async (id) => {
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
        title="Settings"
        tableRef={tableRef}
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${
            query.pageSize
          }`;
          if (filterurl !== "") {
            urlPaginate = `${urlPaginate}${filterurl}`
          }
          return await getSettings(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px", marginBottom: "5px" }}>
                <AccessControl
                  hasAccess="setting create"
                  checkID={user.user.id}
                >
                  <Link to="/cam/settings/create" className="tdnone mr-3">
                    <Button variant="contained" size="small">
                      add settings
                    </Button>
                  </Link>
                </AccessControl>

              {/*
                <AccessControl
                  hasAccess="setting create"
                  checkID={user.user.id}
                >
                  <Link to="/cam/settings/import" className="tdnone">
                    <Button variant="contained" size="small">
                      Import settings
                    </Button>
                  </Link>
                </AccessControl>
              */}
              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: "visibility",
            tooltip: "View ettings",
            hidden: TableActionControl("setting view", permission),
            onClick: (event, rowData) =>
              history.push(`/cam/settings/view/${rowData.campaign_id}`),
          },
          {
            icon: "edit",
            tooltip: "Edit Client",
            hidden: TableActionControl("setting update", permission),
            onClick: (event, rowData) =>
              history.push(`/cam/settings/edit/${rowData.campaign_id}`),
          }
        ]}
         editable={{
          isDeletable: (rowData) =>
            !TableActionControl("setting delete", permission),
          isDeleteHidden: (rowData) =>
            TableActionControl("setting delete", permission),
          onRowDelete: async (oldData) => {
            await deleteSettings(oldData.campaign_id);
          },
        }}
        options={{
          actionsColumnIndex: -1,
          search: false,
          pageSize: pageSize,
          filtering: true,
          exportButton: { csv: true },
          exportCsv: (columns, data) => {
            let token = `token=${user.access_token}`
            let exportUrl = `${localStorage.api}/exportSetting?${token}${filterurl}`
            window.open(exportUrl, '_blank');
          }
        }}
      />
    </Fragment>
  );
};

const linkTags = { color: "inherit" };

export default List;
