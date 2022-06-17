import React from 'react'
import TextField from "@mui/material/TextField";
import useStore from "../../store";
import Grid from "@mui/material/Grid";
import {Link, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";


export default function Account() {
  let navigate = useNavigate()
  const user = useStore(store => store.user)
  const setUser = useStore(store => store.setUser)
  const setLoggedIn = useStore(store => store.setLoggedIn)

  function closeAccount() {
    setUser({
      email: '<deleted>',
      username: '<deleted>'
    })
    setLoggedIn()
    navigate("/")
  }

  return <Grid container direction="column" spacing={2}>
    <Grid item>
      <TextField
        fullWidth
        disabled
        id="email"
        label="Email"
        defaultValue={user.email}
      />
    </Grid>
    <Grid item>
      <TextField
        fullWidth={true}
        id="username"
        label="Username"
        defaultValue={user.username}
      />
    </Grid>
    <Grid item>
      <Button fullWidth variant="contained" component={Link} to="/account/billing">Billing</Button>
    </Grid>
    <Grid item>
      <Button
        fullWidth
        variant="contained"
        color="error"
        onClick={closeAccount}
      >
        Close Account
      </Button>
    </Grid>
  </Grid>
}