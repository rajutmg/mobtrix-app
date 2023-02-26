import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { PermissionContext } from "../../context/PermissionContext";
import AddContact from "./contacts/AddContact";
import EditContact from "./contacts/EditContact";
import DeleteModal from "../../layouts/modal/DeleteModal";
import AccessControl from "../../utils/AccessControl";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import AddSettingKeys from "./settings/AddSettingKeys";
import EditSetingKeys from "./settings/EditSetingKeys";

const ShowClient = () => {
  const { id } = useParams();
  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const url = `${localStorage.api}/clients/${id}`;
  const deleteContactURL = `${localStorage.api}/contact`;

  useEffect(() => {
    getClientdata();
    // eslint-disable-next-line
  }, []);

  const defaultClient = {
    name: "",
    manager: "",
    country: "",
    details: "",
  };

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(defaultClient);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentContact, setCurrentContact] = useState({});
  const [contactApproved, setContactApproved] = useState(false);

  const [openSetting, setOpenSetting] = useState(false);
  const [openEditSetting, setOpenEditSetting] = useState(false);
  const [currentSetting, setCurrentSetting] = useState({});
  const [openDeleteSetting, setOpenDeleteSetting] = useState(false);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getClientdata = async () => {
    let res = await axios.get(url, headers);
    setClient(res.data.data);
    checkApprovedContact(res.data.data);
    setLoading(false);
  };

  /*Checks if any one of the contact is approved*/
  const checkApprovedContact = (data) => {
    if (data.contacts === undefined || data.contacts.length === 0) {
      return false;
    }
    let approved = data.contacts.filter(
      (item) => item.approval_authorization === 1
    );
    setContactApproved(approved[0]);
  };

  const onAddContact = () => {
    setOpenAdd(true);
  };

  const onEditContact = (data) => {
    setCurrentContact(data);
    setOpenEdit(true);
  };

  const onDeleteContact = (data) => {
    setCurrentContact(data);
    setOpenDelete(true);
  };

  const onAddSetting = () => {
    setOpenSetting(true);
  };

  const onEditSetting = (data) => {
    setCurrentSetting(data);
    setOpenEditSetting(true);
  };

  const onDeleteSetting = (data) => {
    setCurrentSetting(data);
    setOpenDeleteSetting(true);
  };

  const deleteContact = async (id) => {
    let res = await axios.delete(deleteContactURL + "/" + id, headers);
    if (res.data.status === "fail") {
      console.log(res.data.message);
    }
    setOpenDelete(false);
    window.location.reload();
  };

  const deleteSetting = async (id) =>{
    let res = await axios.delete(`${localStorage.api}/client/settings/${id}`, headers);
    if (res.data.status === "fail") {
      console.log(res.data.message);
    }
    setOpenDeleteSetting(false);
    window.location.reload();
  } 

  if (loading) {
    return <p>Loading...</p>;
  }

  if (client === null) {
    return <p>Client not found.</p>;
  }

  if (
    user.user.id !== client.manager_id &&
    !["Super Admin", "Admin"].includes(permission.role)
  ) {
    return <p>You do not have the permission.</p>;
  }

  return (
    <div>
      <AddSettingKeys
        openSetting={openSetting}
        setOpenSetting={setOpenSetting}
      />
      <EditSetingKeys
        openEdit={openEditSetting}
        setOpenEdit={setOpenEditSetting}
        currentSetting={currentSetting}
        setCurrentSetting={setCurrentSetting}
        clientid={id}
      />
      <DeleteModal
        modalIsOpen={openDeleteSetting}
        setmodalIsOpen={setOpenDeleteSetting}
        item={currentSetting}
        deleteItem={deleteSetting}
      />

      <AddContact openAdd={openAdd} setOpenAdd={setOpenAdd} />
      <EditContact
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        currentContact={currentContact}
        setCurrentContact={setCurrentContact}
        contactApproved={contactApproved}
      />
      <DeleteModal
        modalIsOpen={openDelete}
        setmodalIsOpen={setOpenDelete}
        item={currentContact}
        deleteItem={deleteContact}
      />

      <h2>Show Client</h2>
      <Grid container className="my-2" spacing={3}>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Client Name"
            value={client.name}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            label="Client Code"
            value={client.client_code}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            label="Manager"
            value={client.manager}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            label="Country"
            value={client.country}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            label="Created at"
            fullWidth
            value={new Date(client.created_at).toDateString()}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={8} sm={8}>
          <TextField
            id="outlined-textarea"
            label="Details"
            multiline
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            value={client.details}
          />
        </Grid>
      </Grid>

      <Divider />
      {/*Add settings button*/}
      <Grid item xs={12}>
        <h3>Settings</h3>
        <AccessControl hasAccess="client create" checkID={client.manager_id}>
          <Button
            color="primary"
            variant="contained"
            onClick={onAddSetting}
            size="small"
          >
            Add Settings
          </Button>
        </AccessControl>

        {/*List setting changes*/}
        {client.settings !== undefined ? (
          client.settings.map((setting, key) => (
            <Grid key={key} container className="mt-2" spacing={3}>
              {/*contact name*/}
              <Grid item xs={3} sm={3}>
                <div>
                  <span className="mr-1">{key + 1 + "."}</span>
                  {setting.label}
                </div>
              </Grid>

              {/*Contact update/Delete*/}
              <Grid item xs={3} sm={4}>
                <div>
                  <AccessControl
                    hasAccess="client create"
                    checkID={client.manager_id}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ padding: "2px" }}
                      onClick={(e) => onEditSetting(setting)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                  </AccessControl>

                  <AccessControl
                    hasAccess="client create"
                    checkID={client.manager_id}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ padding: "2px" }}
                      onClick={(e) => onDeleteSetting(setting)}
                      className="mr-3"
                    >
                      Delete
                    </Button>
                  </AccessControl>
                </div>
              </Grid>
            </Grid>
          ))
        ) : (
          <p>No Settings.</p>
        )}
      </Grid>

      <Divider className="mt-3" />
      <h3>Contacts</h3>
      {/*Add contacts button*/}
      <AccessControl hasAccess="client create" checkID={client.manager_id}>
        <Button
          variant="contained"
          onClick={onAddContact}
          color="primary"
          size="small"
        >
          Add Contact
        </Button>
      </AccessControl>

      {/*Contact headings*/}
      {client.contacts.length !== 0 ? (
        <Grid
          container
          spacing={3}
          className="mt-2"
          style={{ fontWeight: 500 }}
        >
          <Grid item xs={2} sm={2}>
            <div>Name</div>
          </Grid>
          <Grid item xs={3} sm={3}>
            <div>Email</div>
          </Grid>
          <Grid item xs={2} sm={2}>
            <div>Role</div>
          </Grid>
          <Grid item xs={2} sm={2}>
            <div>Authorization</div>
          </Grid>
          <Grid item xs={3} sm={3}>
            <div>Actions</div>
          </Grid>
        </Grid>
      ) :  ""}
      
      {client.contacts !== undefined
        ? client.contacts.map((contact, key) => (
            <Grid key={contact.id} container className="mt-2" spacing={3}>
              {/*contact name*/}
              <Grid item xs={2} sm={2}>
                <div>
                  <span className="mr-1">{key + 1 + "."}</span>
                  {contact.contact_name}
                </div>
              </Grid>

              {/*contact email*/}
              <Grid item xs={3} sm={3}>
                <div>{contact.email}</div>
              </Grid>

              {/*contact role*/}
              <Grid item xs={2} sm={2}>
                <div>{contact.role}</div>
              </Grid>

              {/*Authorization approval*/}
              <Grid item xs={2} sm={2}>
                <div>
                  {contact.approval_authorization ? (
                    <span>Approved</span>
                  ) : (
                    <span>Not Approved</span>
                  )}
                </div>
              </Grid>

              {/*Contact update/Delete*/}
              <Grid item xs={3} sm={3}>
                <div>
                  <AccessControl
                    hasAccess="client create"
                    checkID={client.manager_id}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ padding: "2px" }}
                      onClick={(e) => onEditContact(contact)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                  </AccessControl>

                  <AccessControl
                    hasAccess="client create"
                    checkID={client.manager_id}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ padding: "2px" }}
                      onClick={(e) => onDeleteContact(contact)}
                      className="mr-3"
                    >
                      Delete
                    </Button>
                  </AccessControl>
                </div>
              </Grid>
            </Grid>
          ))
        : "No contacts."}
    </div>
  );
};

export default ShowClient;
