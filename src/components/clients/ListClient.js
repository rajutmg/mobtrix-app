import React, { Fragment, useState, useContext, createRef } from "react";
import { UserContext } from "../../context/UserContext";
import { PermissionContext } from "../../context/PermissionContext";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AccessControl from "../../utils/AccessControl";
import TableActionControl from "../../utils/TableActionControl";
import SimpleSnackbar from "../../layouts/feedback/SimpleSnackbar";

import MaterialTable, { MTableToolbar } from "material-table";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

const ListClient = () => {
  const url = `${localStorage.api}/clients`;
  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const history = useHistory();
  const tableRef = createRef();
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const pageSize = parseInt(process.env.REACT_APP_paginateSize);
  const [date, setDate] = useState(["", ""]);

  let filterurl = "";
  let filter = {
    name: "",
    client: "",
    manager: "",
    country: "",
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getClients = async (urlPaginate) => {
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

  const deleteClient = async (id) => {
    let data = await axios.delete(url + "/" + id, headers);
    setToast(data.data.message);
  };

  const setFilterQuery = (e) => {
    let key = e.target.name;
    filter[key] = e.target.value;
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
    if (date !== null) {
      let fromdate = date[0].toLocaleDateString('en-CA');      
      let todate = date[1].toLocaleDateString('en-CA');      
      filterurl += `&fromdate=${fromdate} 00:00:00&todate=${todate} 23:59:59`;
    }

    // refresh the material table
    tableRef.current && tableRef.current.onQueryChange();
  };

  const columns = [
    {
      title: "Name",
      field: "name",
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
        <Link to={`/client/${rowData.id}`} style={linkTags}>
          {rowData.name}
        </Link>
      ),
    },
    {
      title: "Client Code",
      field: "client_code",
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
      title: "Manager",
      field: "manager",
      filterComponent: () => (
        <TextField
          name="manager"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
    },
    {
      title: "Country",
      field: "country",
      filterComponent: () => (
        <TextField
          name="country"
          size="small"
          variant="outlined"
          autoComplete="off"
          onChange={setFilterQuery}
          onKeyPress={filterClient}
        />
      ),
      render: (rowData) => <span>{`${rowData.country} (${rowData.country_code})`}</span>,
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
      render: (rowData) => <span>{new Date(rowData.created_at).toDateString()}</span>,
    },
  ];

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <Fragment>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <MaterialTable
        title="Client"
        tableRef={tableRef}
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${query.pageSize}`;

          if (filterurl !== "") {
            urlPaginate = `${urlPaginate}${filterurl}`;
          }
          // console.log(urlPaginate);
          return await getClients(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px", marginBottom: "5px" }}>
                <AccessControl hasAccess="client create" checkID={user.user.id}>
                  <Link to="/client/create" className="tdnone">
                    <Button variant="contained" size="small">
                      add client
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
            tooltip: "Edit Client",
            hidden: TableActionControl("client update", permission),
            onClick: (event, rowData) => history.push(`/client/edit/${rowData.id}`),
          },
        ]}
        editable={{
          isDeletable: (rowData) => !TableActionControl("client delete", permission),
          isDeleteHidden: (rowData) => TableActionControl("client delete", permission),
          onRowDelete: async (oldData) => {
            await deleteClient(oldData.id);
          },
        }}
        options={{
          actionsColumnIndex: -1,
          search: false,
          pageSize: pageSize,
          filtering: true,
          exportButton: { csv: true },
          exportCsv: (columns, data) => {
            let token = `token=${user.access_token}`;
            let exportUrl = `${localStorage.api}/exportClient?${token}${filterurl}`;
            window.open(exportUrl, "_blank");
          },
        }}
      />
    </Fragment>
  );
};

const linkTags = { color: "inherit" };

export default ListClient;
