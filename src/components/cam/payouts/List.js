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
  const url = `${localStorage.api}/payout`;
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

    operator: "",
    client_name: "",
    payout: "",
    country: "",
    date:""
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

    if (date !== null) {
      let fromdate = date[0].toLocaleDateString('en-CA');      
      let todate = date[1].toLocaleDateString('en-CA');      
      filterurl += `&fromdate=${fromdate} 00:00:00&todate=${todate} 23:59:59`;
    }

    // refresh the material table
    tableRef.current && tableRef.current.onQueryChange();
  };
  const columns = [

    { title: "Client", field: "client_name",
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
    { title: "Country", field: "country",
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
    },
    { title: "Operator", field: "operator",
    filterComponent: () => (
      <TextField
        name="operator"
        size="small"
        variant="outlined"
        autoComplete="off"
        onChange={setFilterQuery}
        onKeyPress={filterClient}
      />
    ), 
    },
    { title: "Payout", field: "payout",
    filterComponent: () => (
      <TextField
        name="payout"
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

  const getPayout = async (urlPaginate) => {
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

  const deletePayout = async (id) => {
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
        title="Payout"
        tableRef={tableRef}
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${
            query.pageSize
          }`;
          if (filterurl !== "") {
            urlPaginate = `${urlPaginate}${filterurl}`
          }
          return await getPayout(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px", marginBottom: "5px" }}>
                <AccessControl
                  hasAccess="payout create"
                  checkID={user.user.id}
                >
                  <Link to="/cam/payouts/create" className="tdnone">
                    <Button variant="contained" size="small">
                      add Payout
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
            tooltip: "Edit Payout",
            hidden: TableActionControl("payout update", permission),
            onClick: (event, rowData) =>
              history.push(`/cam/payouts/edit/${rowData.id}`),
          },
        ]}
        editable={{
          isDeletable: (rowData) =>
            !TableActionControl("payout delete", permission),
          isDeleteHidden: (rowData) =>
            TableActionControl("payout delete", permission),
          onRowDelete: async (oldData) => {
            await deletePayout(oldData.id);
          },
        }}
        options={{
          actionsColumnIndex: -1,
          search: false,
          pageSize: pageSize,
          exportButton: { csv: true },
          filtering: true,
          exportCsv: (columns, data) => {
            let token = `token=${user.access_token}`
            let exportUrl = `${localStorage.api}/exportPayout?${token}${filterurl}`
            window.open(exportUrl, '_blank');
          }
        }}
      />
    </Fragment>
  );
};

export default List;
