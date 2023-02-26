import React from 'react';
import {Link} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PropTypes from 'prop-types'

export default function SimpleMenu({user, logOutUser}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clearUserdata = () =>{
    logOutUser();
  }

  return (
    <div style ={{marginLeft:'auto'}}>
    <span>{user.username} </span>
      <Button aria-controls="simple-menu" style={{color:'#fff'}} aria-haspopup="true" onClick={handleClick}>
        <AccountCircleIcon /> 
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
      <Link to={'/profile/me'} style={linkStyle}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
      </Link>
        <MenuItem onClick={clearUserdata}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

SimpleMenu.propTypes = {
  user: PropTypes.object.isRequired,
  logOutUser: PropTypes.func.isRequired,
}

const linkStyle = {
  textDecoration : 'none',
  color: 'inherit'
}