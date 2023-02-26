import React from "react";
import MaterialTable from "material-table";
import { Paper } from "@material-ui/core";

const ListHostRecord = ({ domain, records, setRecord }) => {

  //updateHostRecord
  const updateHostRecord = async (newData) => {
    let index = records.findIndex((item) => item.HostId === newData.HostId);
    let res = [...records];
    res.splice(index,1,newData);
    setRecord(res);
  };

  // deleteHostRecord
  const deleteHostRecord = (newData) => {
    let res = records.filter((item) => item !== newData);
    setRecord(res);
  };
  const columns = [
    {
      title: "Type",
      field: "Type",
      lookup: {
        A: "A",
        AAAA: "AAAA",
        ALIAS: "ALIAS",
        CAA: "CAA",
        CNAME: "CNAME",
        TXT: "TXT",
        URL: "URL",
      },
    },
    { title: "Host", field: "Name" },
    { title: "Value", field: "Address" },
    {
      title: "TTL",
      field: "TTL",
      lookup: {
        60: "1 Min",
        300: "5 Min",
        1200: "20 Min",
        1800: "30 Min",
        3600: "60 Min"
      }
      ,
    },
  ];

  return (
    <div>
      <MaterialTable
        columns={columns}
        data={records}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div>
              <h3>DNS Host Record</h3>
            </div>
          ),
        }}
        options={{
          paging: false,
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowUpdate: async (newData) => {
            await updateHostRecord(newData);
          },
          onRowDelete: async (newData) => {
            await deleteHostRecord(newData);
          },
        }}
      />
    </div>
  );
};

export default ListHostRecord;
