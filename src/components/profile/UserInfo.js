import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Loader from '../../layouts/feedback/Loader';

const UserInfo = () => {
	const url = `${localStorage.api}/me/user`;
	const [user] = useContext(UserContext);
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getCurentUser();
		// eslint-disable-next-line
	}, []);

	const defaultProfile = {
		avatar: "",
		fname: "",
		lname: "",
		email: "",
		email_verified_at: "",
		role: "",
	};

	const [profile, setProfile] = useState(defaultProfile);

	let headers = {
		headers: { Authorization: `${user.token_type} ${user.access_token}` },
	};

	const getCurentUser = async () => {
		let res = await axios.get(url, headers).catch((error) => {
			return error.response;
		});
		setProfile(res.data.data);
		setLoading(false);
	};

	const classes = useStyles();


	if (loading) {
		return <div><Loader/></div>
	}
	return (
		<div>
			<Avatar
				alt={profile.username}
				src={profile.avatar}
				className={classes.large}
			/>

			<Grid container spacing={3}>
				<Grid item xs={6} sm={4}>
					<TextField
						fullWidth
						label="First Name"
						value={profile.fname}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>

				<Grid item xs={6} sm={4}>
					<TextField
						fullWidth
						label="Last Name"
						value={profile.lname}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>

				<Grid item xs={6} sm={4}>
					<TextField
						fullWidth
						label="Email"
						value={profile.email}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid item xs={6} sm={4}>
					<TextField
						fullWidth
						label="Role"
						value={user.role}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>

				<Grid item xs={6} sm={4}>
					<TextField
						fullWidth
						label="Email Verified"
						value={
							profile.email_verified_at
								? new Date(profile.email_verified_at).toDateString()
								: "Not Verified"
						}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>

				<Grid item xs={6} sm={4}>
					<TextField
						fullWidth
						label="Joined date"
						value={
							profile.created_at
								? new Date(profile.created_at).toDateString()
								: "N/A"
						}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default UserInfo;

const useStyles = makeStyles((theme) => ({
	large: {
		width: theme.spacing(15),
		height: theme.spacing(15),
		marginBottom: "20px",
	},
}));
