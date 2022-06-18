import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import useStore from 'store'

import { API } from "aws-amplify";
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import {InstanceForm} from 'store/schemas'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod/dist/zod";
import Stack from "@mui/material/Stack";
import {LoadingButton} from "@mui/lab";
import {onError} from "../../../lib/errors";
import MenuItem from "@mui/material/MenuItem";


export default function Create() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<InstanceForm>({
    resolver: zodResolver(InstanceForm),
    defaultValues: {
      instanceType: "g5.2xlarge",
      storage: 512,
      spot: false,
      region: 'us-east-1'
    }
  })

  const nav = useNavigate()

  async function onSubmit(form: InstanceForm) {
    setLoading(true)
    try {
      await API.post("instances", "/instances", {
        body: form,
      })
      nav(`/instances`);
    } catch (e) {
      onError(e)
    }
    setLoading(false)
  }

  return (
    <Stack
      component="form"
      spacing={3}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        select
        label="Instance Type"
        {...register("instanceType")}
      >
        {[
          {k: 'g5.2xlarge', v: 'g5.2xlarge'},
          {k: 'g5.xlarge', v: 'g5.xlarge'},
          {k: 'p2.xlarge', v: 'p2.xlarge'},
        ].map(({k, v}) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
      </TextField>
      <TextField
        fullWidth={true}
        label="Storage"
        variant="outlined"
        type="number"
        {...register("storage")}
      />
      <FormGroup>
        <FormControlLabel
          control={<Checkbox {...register("spot")} />}
          label="Spot Instance"
        />
      </FormGroup>
      <TextField
        fullWidth={true}
        label="Region"
        variant="outlined"
        {...register("region")}
      />
      <LoadingButton
        loading={loading}
        variant="contained"
        type="submit"
      >Save</LoadingButton>
    </Stack>
  )
}