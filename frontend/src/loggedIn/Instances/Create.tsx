import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import useStore from '../../store'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface BasicSelectProps {
  id: string
  label: string
  item: any
  setItem: any
  options: {value: string, label: string}[]
  form: any
}

function BasicSelect({id, form, label, item, setItem, options}: BasicSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string
    setItem({
      ...form,
      [id]: value
    })
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId={id}
          id={id}
          value={item}
          label={label}
          onChange={handleChange}
        >
          {options.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}


export default function Create() {
  const addInstance = useStore(store => store.addInstance)

  let navigate = useNavigate();
  const [form, setForm] = useState({
    instanceType: 'g5.2xlarge',
    storage: "512",
    spot: false,
    region: 'us-east-1',
  })

  const instanceTypes = [
    {value: 'g5.2xlarge', label: 'g5.2xlarge'},
    {value: 'g5.xlarge', label: 'g5.xlarge'},
    {value: 'p2.xlarge', label: 'p2.xlarge'},
  ]

  function changeText(event: any) {
    const id = event.target.id
    const value = event.target.value
    setForm({
      ...form,
      [id]: value
    })
  }

  function save() {
    // POST to /instances this form, comment out below code
    addInstance({
      ...form,
      instanceId: '123',
      dateCreated: new Date().toDateString()
    })
    navigate(`/instances`);
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
      <BasicSelect
        form={form}
        id="instanceType"
        label="Instance Type"
        item={form.instanceType}
        setItem={setForm}
        options={instanceTypes}
      />
      {/*<TextField id="instanceType" label="Instance Type" variant="outlined" />*/}
      <TextField
        fullWidth={true}
        id="storage"
        label="Storage"
        variant="outlined"
        value={form.storage}
        onChange={changeText}
      />
      <TextField
        fullWidth={true}
        id="spot"
        label="Spot"
        variant="outlined"
        onChange={changeText}
      />
      <TextField
        fullWidth={true}
        id="region"
        label="Region"
        variant="outlined"
        onChange={changeText}
      />
      <Button
        variant="contained"
        onClick={save}
      >Save</Button>
    </Box>
  </div>
}