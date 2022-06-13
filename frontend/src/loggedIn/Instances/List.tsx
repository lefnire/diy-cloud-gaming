import React, {useState, useEffect} from 'react'
import useStore from '../../store'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom'


export default function List() {
  const instances = useStore(store => store.instances)

  return <div>
    <Button
      variant="contained"
      component={Link}
      to="/instances/new"
      sx={{mb: 2}}
    >
      Create Instance
    </Button>

    {instances.map((instance) => <>
      <Card sx={{minWidth: 275, mb: 2}}>
        <CardContent>
          <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
            {instance.instanceId}
          </Typography>
          <Typography variant="h5" component="div">
            {instance.dateCreated}
          </Typography>
          <Typography variant="h5" component="div">
            {instance.storage}
          </Typography>
          <Typography variant="h5" component="div">
            {instance.region}
          </Typography>
        </CardContent>
        <CardActions>
          <>
            <Button size="small">Manage</Button>
            {/* manage = take a snapshot | delete | share */}
          </>
        </CardActions>
      </Card>
    </>)}
  </div>
}