import React, { Fragment, useState, useContext } from "react";
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
import { useParams } from "react-router-dom";


const View = () => {
    const {id} = useParams();
  const url = `${localStorage.api}/country/operators/${id}`;
  const delete_url = `${localStorage.api}/country/operators/`;
  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const history = useHistory();
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const pageSize = parseInt(process.env.REACT_APP_paginateSize);


  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const columns = [
    {
      title: "Label",
      field: "label",
    },
    {
      title: "Value",
      field: "value",
      
    },
    {
      title: "Created At",
      field: "created_at",
      render: (rowData) => (
        <span>{new Date(rowData.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  const getOperators = async (urlPaginate) => {
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

  const deleteOperators = async (id) => {
    let data = await axios.delete(delete_url + id, headers);
    setToast(data.data.message);
  };

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <Fragment>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <MaterialTable
        title="Operators"
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${
            query.pageSize
          }`;
          return await getOperators(urlPaginate);
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
                 <Link to={{
                      pathname: `/cam/operators/addoperator/${id}`,

                    }}
                    style={{ textDecoration: "none" }}
                    >
                      <Button variant="contained" size="small" className="mr-3">
                        add operator values
                                  </Button>
                    </Link>
       
                </AccessControl>

                <a href={`${localStorage.api}/operators/export/${id}?token=${user.access_token}`}
                  target="_blank" rel="noreferrer" 
                  style={{ textDecoration: "none" }}>
                  <Button variant="contained" size="small">
                      Export to Json
                    </Button>
                </a>

              </div>
            </div>
          ),
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit operators",
            hidden: TableActionControl("operators update", permission),
            onClick: (event, rowData) =>
              history.push(`/cam/operators/editoperator/${rowData.id}`),
          }
        ]}
        editable={{
          isDeletable: (rowData) =>
            !TableActionControl("campaign delete", permission),
          isDeleteHidden: (rowData) =>
            TableActionControl("campaign delete", permission),
          onRowDelete: async (oldData) => {
            await deleteOperators(oldData.id);
          },
        }}
        options={{
          actionsColumnIndex: -1,
          search: false,
          pageSize: pageSize,
        }}
      />
    </Fragment>
  );
};


export default View;
