import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import SimpleSnackbar from "../../layouts/feedback/SimpleSnackbar";
import RegisterModal from "./RegisterModal";
import { useHistory } from "react-router-dom";

const Pricing = ({ domain, pricing }) => {
  const [user] = useContext(UserContext);
  const url = `${localStorage.api}/namecheap/createdomain`;
  const history = useHistory();
  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const [createDomain, setCreateComain] = useState({
    domain: domain,
    years: "1",
  });

  const [domainPrice, setDomainPrice] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setDomainPrice(pricing[0]);
    // eslint-disable-next-line
  }, [pricing]);

  const getPriceforYear = (year, pricing) => {
    setDomainPrice(pricing[year - 1]);
  };

  const registerDomain = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOpen(false);
    let res = await axios.post(url, createDomain, headers);
    if (res.data.statusCode === 403) {
      setError(res.data.message);
      return false;
    }
    setLoading(false);
    setToast(res.data.message);
    history.push(`/namecheap/domain/${res.data.data.Domain}`);
  };

  return (
    <div>
      <p>{error ? error : ""}</p>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <Table className="" size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Domain Registration </TableCell>
            <TableCell align="left">Duration (Year)</TableCell>
            <TableCell align="left">Retail Price</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              <p>{domain}</p>
            </TableCell>

            <TableCell align="left">
              {/*Duration*/}
              <FormControl>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={createDomain.years}
                  onChange={(e) => {
                    setCreateComain({ ...createDomain, years: e.target.value });
                    getPriceforYear(e.target.value, pricing);
                  }}
                >
                  {/*{
                  Comment the lricing for the 5 years

                pricing.map((price, index) => (
                  <MenuItem
                    key={index}
                    value={price.Duration}
                    onChange={(e) => console.log("sadasd")}
                  >{`${price.Duration} ${price.DurationType}`}</MenuItem>
                ));
              }*/}

                  <MenuItem
                    key={10}
                    value={pricing[0].Duration}
                    onChange={(e) => console.log("sadasd")}
                  >
                    {`${pricing[0].Duration} ${pricing[0].DurationType}`}
                  </MenuItem>
                </Select>
              </FormControl>
            </TableCell>

            {/*Retail price*/}
            <TableCell align="left">
              <p>
                {domainPrice.Currency} : {domainPrice.Price}
              </p>
              <p>ICCAN Fee : {domainPrice.AdditionalCost}</p>
              <Divider />
              <strong>Total</strong>
              <p>
                {(parseFloat(domainPrice.Price) + parseFloat(domainPrice.AdditionalCost)).toFixed(
                  2
                )}{" "}
                * {domainPrice.Duration} = {""}
                {(
                  (parseFloat(domainPrice.Price) + parseFloat(domainPrice.AdditionalCost)).toFixed(
                    2
                  ) * domainPrice.Duration
                ).toFixed(2)}
              </p>
            </TableCell>

            {/*Register button*/}
            <TableCell align="left">
              <RegisterModal
                registerDomain={registerDomain}
                open={open}
                setOpen={setOpen}
                loading={loading}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Pricing;
