import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { PermissionProvider } from "./context/PermissionContext";
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";

const Theme = createMuiTheme({
  palette: {
    type: "light",
  }
});

ReactDOM.render(
  <React.StrictMode>
  <ThemeProvider theme={Theme}>
    <UserProvider>
      <PermissionProvider>
        <App />
      </PermissionProvider>
    </UserProvider>
     </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
