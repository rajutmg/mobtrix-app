import React, { Fragment, useState, useContext, createRef } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { PermissionContext } from "../../context/PermissionContext";
import AccessControl from "../../utils/AccessControl";
import TableActionControl from "../../utils/TableActionControl";
import SimpleSnackbar from "../../layouts/feedback/SimpleSnackbar";
import MaterialTable, { MTableToolbar } from "material-table";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

const ListProject = ({ data }) => {
  const url = `${localStorage.api}/projects`;
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
    url: "",
    manager: "",
    date: "",
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getProjects = async (urlPaginate) => {
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

  const deleteProject = async (id) => {
    let data = await axios.delete(url + "/" + id, headers);
    setToast(data.data.message);
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

    if (date !== null) {
      let fromdate = date[0].toLocaleDateString("en-CA");
      let todate = date[1].toLocaleDateString("en-CA");
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
        <Link to={`/project/${rowData.id}`} style={linkTags}>
          {rowData.name}
        </Link>
      ),
    },
    {
      title: "Public URL",
      field: "public_url",
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
        <a href={rowData.public_url} style={linkTags} target="_blank" rel="noreferrer">
          {rowData.public_url}
        </a>
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
        title="Project"
        tableRef={tableRef}
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${query.pageSize}`;

          if (filterurl !== "") {
            urlPaginate = `${urlPaginate}${filterurl}`;
          }
          return await getProjects(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px", marginBottom: "5px" }}>
                <AccessControl hasAccess="project create" checkID={user.user.id}>
                  <Link to="/project/create" className="tdnone">
                    <Button variant="contained" size="small">
                      add project
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
            tooltip: "Edit Project",
            hidden: TableActionControl("project update", permission),
            onClick: (event, rowData) => history.push(`/project/edit/${rowData.id}`),
          },
        ]}
        editable={{
          isDeletable: (rowData) => !TableActionControl("project delete", permission),
          isDeleteHidden: (rowData) => TableActionControl("project delete", permission),
          onRowDelete: async (oldData) => {
            await deleteProject(oldData.id);
          },
        }}
        options={{
          actionsColumnIndex: -1,
          pageSize: pageSize,
          search: false,
          filtering: true,
          exportButton: { csv: true },
          exportCsv: (columns, data) => {
            let token = `token=${user.access_token}`;
            let exportUrl = `${localStorage.api}/exportProject?${token}${filterurl}`;
            window.open(exportUrl, "_blank");
          },
        }}
      />
    </Fragment>
  );
};

const linkTags = { color: "inherit" };

export default ListProject;
