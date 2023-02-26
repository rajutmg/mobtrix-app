import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Loader from "../../layouts/feedback/Loader";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getValidationErrors } from "../../utils/FormValidator";
import SimpleSnackbar from "../../layouts/feedback/SimpleSnackbar";

const NamecheapUser = () => {
	const [user] = useContext(UserContext);
	const [loading, setLoading] = useState(true);
	const url = `${localStorage.api}/namecheap/userDetail/${user.user.id}`;
	useEffect(() => {
		getUserConfig();
		// eslint-disable-next-line
	}, []);

	// default config value
	const defaultConfig = {
		apiuser: "",
		apikey: "",
		username: "",
		clientip: "",
		address: "",
		state_province: "",
		city: "",
		zip_postal: "",
		country: "",
		phone_no: "",
		country_code: "",
		email: user.user.email,
		user_id: user.user.id,
		fname: user.user.fname,
		lname: user.user.lname,
	};

	const [config, setConfig] = useState(defaultConfig);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState({});
	const [toast, setToast] = useState(false);
	let headers = {
		headers: { Authorization: `${user.token_type} ${user.access_token}` },
	};

	// check if user has config stored
	const getUserConfig = async () => {
		let res = await axios.get(url, headers);
		setLoading(false);
		if (res.data.data === null) {
			return false;
		}

		if (res.data.status === "fail") {
			setError(res.data.message);
			return false;
		}
		setConfig(res.data.data);
	};

	// update user namecheap config
	const updateUserConfig = async (e) => {
		e.preventDefault();
		let res = await axios.put(url, config, headers);
		console.log(res.data);

		if (res.data.statusCode === 403) {
			setError(res.data.message);
			return false;
		}
		
		if (res.data.status === "fail") {
			getValidationErrors(res.data.errors, setMessage);
			return false;
		}

		setMessage({});
		setToast(res.data.message);
	};

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return <p>{error}</p>;
	}
	// add/update
	return (
		<div>
			<SimpleSnackbar toast={toast} setToast={setToast} />
			<form noValidate autoComplete="off" onSubmit={updateUserConfig}>
				<Grid container spacing={3}>
					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="First Name *"
							value={config.fname}
							error={message.fname ? true : false}
              helperText={message.fname ?? ""}
							onChange={(e) => setConfig({ ...config, fname: e.target.value })}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Last Name *"
							value={config.lname}
							error={message.lname ? true : false}
              helperText={message.lname ?? ""}
							onChange={(e) => setConfig({ ...config, lname: e.target.value })}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Email *"
							value={config.email}
							error={message.email ? true : false}
              helperText={message.email ?? ""}
							onChange={(e) => setConfig({ ...config, email: e.target.value })}
						/>
					</Grid>

					<Grid item sm={2}>
						<TextField
							fullWidth
							label="Country Code *"
							value={config.country_code}
							error={message.country_code ? true : false}
              helperText={message.country_code ?? ""}
							placeholder="351"
							onChange={(e) =>
								setConfig({ ...config, country_code: e.target.value })
							}
						/>
					</Grid>
					<Grid item sm={4}>
						<TextField
							fullWidth
							label="Phone no. *"
							value={config.phone_no}
							error={message.phone_no ? true : false}
              helperText={message.phone_no ?? ""}
							onChange={(e) =>
								setConfig({ ...config, phone_no: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Apiuser *"
							value={config.apiuser}
							error={message.apiuser ? true : false}
              helperText={message.apiuser ?? ""}
							onChange={(e) =>
								setConfig({ ...config, apiuser: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="ApiKey *"
							value={config.apikey}
							error={message.apikey ? true : false}
              helperText={message.apikey ?? ""}
							onChange={(e) => setConfig({ ...config, apikey: e.target.value })}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Namecheap username *"
							value={config.username}
							error={message.username ? true : false}
              helperText={message.username ?? ""}
							onChange={(e) =>
								setConfig({ ...config, username: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Client IP *"
							value={config.clientip}
							error={message.clientip ? true : false}
              helperText={message.clientip ?? ""}
							onChange={(e) =>
								setConfig({ ...config, clientip: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Country *"
							value={config.country}
							error={message.country ? true : false}
              helperText={message.country ?? ""}
							onChange={(e) =>
								setConfig({ ...config, country: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="City *"
							value={config.city}
							error={message.city ? true : false}
              helperText={message.city ?? ""}
							onChange={(e) => setConfig({ ...config, city: e.target.value })}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="State/Province *"
							value={config.state_province}
							error={message.state_province ? true : false}
              helperText={message.state_province ?? ""}
							onChange={(e) =>
								setConfig({ ...config, state_province: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Zip/Postal Code *"
							value={config.zip_postal}
							error={message.zip_postal ? true : false}
              helperText={message.zip_postal ?? ""}
							onChange={(e) =>
								setConfig({ ...config, zip_postal: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={6} sm={6}>
						<TextField
							fullWidth
							label="Address *"
							value={config.address}
							error={message.address ? true : false}
              helperText={message.address ?? ""}
							onChange={(e) =>
								setConfig({ ...config, address: e.target.value })
							}
						/>
					</Grid>

					<Grid item xs={12}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							size="small"
						>
							Update
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default NamecheapUser;
