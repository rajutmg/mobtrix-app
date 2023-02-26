import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import FormHelperText from "@material-ui/core/FormHelperText";

const AddHostRecord = ({ records, setRecord }) => {
  const defaultRecord = {
    Type: "",
    Name: "",
    Address: "",
    TTL: "",
  };
  const [newRecord, setNewRecord] = useState(defaultRecord);
  const [openAdd, setOpenAdd] = useState(false);
  const [message, setMessage] = useState({});

  const addRecord = (e) => {
    e.preventDefault();
    // validate new record input.
    let errors = validateNewRecord(newRecord);
    if (!errors) {
      return false;
    }

    setRecord([...records, newRecord]);
    setNewRecord(defaultRecord);
    setOpenAdd(false);
  };

  const removeRecord = () => {
    setOpenAdd(false);
    setNewRecord(defaultRecord);
    return false;
  };

  const validateNewRecord = (data) => {
    let validation = {};

    for (let key in data) {
      if (newRecord[`${key}`] === "") {
        validation[`${key}`] = `${key} cannot be empty.`;
      }
    }

    // check if there is one or more errors.
    if (Object.keys(validation).length === 0) {
      return true;
    }

    setMessage(validation);
    return false;
  };
  return (
    <div className="mt-4">
      {/*Add record modal here*/}
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={(e) => {
          setOpenAdd(true);
          setMessage({});
        }}
      >
        Add Record
      </Button>

      {openAdd ? (
        <div>
          <form noValidate autoComplete="off" onSubmit={addRecord}>
            <Grid container spacing={3}>
              {/*Type*/}
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth error={message.Type ? true : false}>
                  <InputLabel id="demo-simple-select-label">Type *</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newRecord.Type}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, Type: e.target.value })
                    }
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="AAAA">AAAA</MenuItem>
                    <MenuItem value="ALIAS">ALIAS</MenuItem>
                    <MenuItem value="CAA">CAA</MenuItem>
                    <MenuItem value="CNAME">CNAME</MenuItem>
                    <MenuItem value="TXT">TXT</MenuItem>
                    <MenuItem value="URL">URL</MenuItem>
                  </Select>
                  <FormHelperText>{message.Type ?? ""}</FormHelperText>
                </FormControl>
              </Grid>

              {/* HOST */}
              <Grid item xs={12} sm={2}>
                <TextField
                  required
                  value={newRecord.Name}
                  label="Host"
                  error={message.Name ? true : false}
                  helperText={message.Name ?? ""}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, Name: e.target.value })
                  }
                />
              </Grid>

              {/*Value*/}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  value={newRecord.Address}
                  label="Value"
                  error={message.Address ? true : false}
                  helperText={message.Address ?? ""}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, Address: e.target.value })
                  }
                />
              </Grid>

              {/*TTL*/}
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth error={message.TTL ? true : false}>
                  <InputLabel id="demo-simple-select-label">TTL *</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newRecord.TTL}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, TTL: e.target.value })
                    }
                  >
                    <MenuItem value={60}>1 Min</MenuItem>
                    <MenuItem value={300}>5 Min</MenuItem>
                    <MenuItem value={1200}>20 Min</MenuItem>
                    <MenuItem value={1800}>30 Min</MenuItem>
                    <MenuItem value={3600}>60 Min</MenuItem>
                  </Select>
                  <FormHelperText>{message.TTL ?? ""}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <IconButton aria-label="add" type="submit">
                  <CheckIcon />
                </IconButton>
                <IconButton aria-label="delete">
                  <DeleteIcon onClick={removeRecord} />
                </IconButton>
              </Grid>
            </Grid>
          </form>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AddHostRecord;
