import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loader = () => {
  return (
    <div style={{textAlign :'center', marginTop :'10%'}}>
      <CircularProgress  />
    </div>
  );
};

export default Loader;
