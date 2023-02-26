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
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

const List = () => {
  const url = `${localStorage.api}/translation`;
  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const history = useHistory();
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const pageSize = parseInt(process.env.REACT_APP_paginateSize);
  const tableRef = createRef();
  const [date, setDate] = useState(["", ""]);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  let filterurl = "";
  let filter = {

    campaign_id: "",
    client: "",
    name: "",
    url: "",
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
    
    if (date !== null) {
      let fromdate = date[0].toLocaleDateString('en-CA');      
      let todate = date[1].toLocaleDateString('en-CA');      
      filterurl += `&fromdate=${fromdate} 00:00:00&todate=${todate} 23:59:59`;
    }

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
    { title: "Translation Name", field: "name",
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
    
    { title: "Client", field: "client",
    filterComponent: () => (
      <TextField
        name="client"
        size="small"
        variant="outlined"
        autoComplete="off"
        onChange={setFilterQuery}
        onKeyPress={filterClient}
      />
    ),
    },
    
    {
      title: "Created At",
      field: "created_at",
      filterComponent: () => (
        <DateRangePicker
          name="date"
          onChange={setDate}
          onKeyPress={filterClient}
          value={date}
          calendarIcon={null}
        />
      ),
      render: (rowData) => (
        <span>{new Date(rowData.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  const getTranslation = async (urlPaginate) => {
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

  const deleteTranslation = async (id) => {
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
        title="Translation"
        tableRef={tableRef}
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${
            query.pageSize
          }`;
          if (filterurl !== "") {
            urlPaginate = `${urlPaginate}${filterurl}`
          }
          return await getTranslation(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px", marginBottom: "5px" }}>
                <AccessControl
                  hasAccess="campaign create"
                  checkID={user.user.id}
                >
                  <Link to="/cam/translation/add" className="tdnone">
                    <Button variant="contained" size="small">
                      Add Translation
                    </Button>
                  </Link>

                </AccessControl>
              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: "visibility",
            tooltip: "View Translation",
            hidden: TableActionControl("campaign update", permission),
            onClick: (event, rowData) =>
              history.push(`/cam/translation/show/${rowData.id}`),
          },
          {
            icon: "edit",
            tooltip: "Edit Translation",
            hidden: TableActionControl("campaign update", permission),
            onClick: (event, rowData) =>
              history.push(`/cam/translation/edit/${rowData.id}`),
          },
        ]}
        editable={{
          isDeletable: (rowData) =>
            !TableActionControl("campaign delete", permission),
          isDeleteHidden: (rowData) =>
            TableActionControl("campaign delete", permission),
          onRowDelete: async (oldData) => {
            await deleteTranslation(oldData.id);
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
            let exportUrl = `${localStorage.api}/exportTranslation?${token}${filterurl}`
            window.open(exportUrl, '_blank');
          }
        }}
      />
    </Fragment>
  );
};

const linkTags = { color: "inherit" };

export default List;
