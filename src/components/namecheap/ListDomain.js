import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import MaterialTable, { MTableToolbar } from "material-table";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";

const ListDomain = () => {
  const [user] = useContext(UserContext);
  const url = `${localStorage.api}/namecheap/list`;
  const pageSize = parseInt(process.env.REACT_APP_paginateSize);
  const [error, setError] = useState(false);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getDomainList = async (urlPaginate) => {
    let res = await axios.get(urlPaginate, headers);
    if (res.data.status === "fail") {
      setError(res.data.message);
      return false;
    }

    // paginated results from backend
    const { domains, Paging } = res.data;
    return {
      data: domains,
      page: parseInt(Paging.CurrentPage) - 1,
      totalCount: parseInt(Paging.TotalItems),
    };
  };

  const columns = [
    {
      title: "Name",
      field: "Name",
      render: (rowData) => (
        <Link to={`/namecheap/domain/${rowData.Name}`}>{rowData.Name}</Link>
      )
    },
    { title: "Owner", field: "User" },
    {
      title: "Created At",
      field: "Created",
      render: (rowData) => (
        <span>{new Date(rowData.Created).toDateString()}</span>
      ),
    },
    {
      title: "Expires At",
      field: "Expires",
      render: (rowData) => (
        <span>{new Date(rowData.Expires).toDateString()}</span>
      ),
    },
    { title: "Expired", field: "IsExpired" },
    { title: "Locked", field: "IsLocked" },
    { title: "WhoisGuard", field: "WhoisGuard" },
  ];

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <MaterialTable
        title="Domains"
        columns={columns}
        data={async (query) => {
          let urlPaginate = `${url}?page=${query.page + 1}&per_page=${
            query.pageSize
          }`;

          return await getDomainList(urlPaginate);
        }}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px", marginBottom: "5px" }}></div>
            </div>
          ),
        }}
        options={{
          actionsColumnIndex: -1,
          pageSize: pageSize,
          search: false,
        }}
      />
    </div>
  );
};

export default ListDomain;
