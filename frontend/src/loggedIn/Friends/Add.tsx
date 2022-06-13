import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import useStore from '../../store'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';


export default function Add() {
  const addFriend = useStore(store => store.addFriend)

  let navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
  })

  function changeText(event: any) {
    const id = event.target.id
    const value = event.target.value
    setForm({
      ...form,
      [id]: value
    })
  }

  function save() {
    addFriend({
      ...form,
      username: 'xyz',
      online: true
    })
    navigate(`/friends`);
  }

  return <div>
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        fullWidth={true}
        id="email"
        label="Email of person to add"
        variant="outlined"
        value={form.email}
        onChange={changeText}
      />
      <Button
        variant="contained"
        onClick={save}
      >Invite</Button>
    </Box>
  </div>
}