import React, {useState, useEffect} from 'react'
import useStore from 'store'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom'
import {API} from 'aws-amplify'
import {onError} from "lib/errors";
import {LoadingButton} from "@mui/lab";
import {Instance} from 'store/schemas'
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {CardMedia} from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

export default function List() {
  const instances = useStore(store => store.instances)
  const setInstances = useStore(store => store.setInstances)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    try {
      // aws-amplify.API ("instances" -> SST.APIGateway (Lambda))
      const instances = await API.get("instances", `/instances`, {})
      setInstances(instances)
    } catch (e) {
      onError(e);
    }
    setLoading(false)
  }

  function renderLoading() {
    return <LoadingButton
      loading={true}
      variant="text"
    >Loading Instances</LoadingButton>
  }

  function renderInstances() {
    return <Grid container spacing={3}>
      {instances.map(instance => <Grid item xs={12} sm={6} lg={4}>
        <Card sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography component="div" variant="h5">
                ID: {instance.id}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                Created At: {new Date(instance.createdAt).toDateString()}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                <ul>
                  <li>Storage: {instance.storage}</li>
                  <li>Region: {instance.region}</li>
                </ul>
              </Typography>
            </CardContent>
          </Box>
          {/*<CardMedia
            component={<VideogameAssetIcon />}
            sx={{ width: 151 }}
            image="/static/images/cards/live-from-space.jpg"
            alt="Live from space album cover"
          />*/}
        </Card>
      </Grid>)}
    </Grid>

  }

  return <div>
    <Button
      variant="contained"
      component={Link}
      to="/instances/new"
      sx={{mb: 2}}
    >
      Create Instance
    </Button>

    {loading ? renderLoading() : renderInstances()}
  </div>
}