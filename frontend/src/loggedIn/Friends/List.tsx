import React from 'react'

import useStore from '../../store'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

export default function List() {
  const friends = useStore(store => store.friends)
  return <div>
    <Button
      variant="contained"
      component={Link}
      to="/friends/add"
      sx={{mb: 2}}
    >
      Invite
    </Button>
    {friends.map(friend => <Card sx={{my: 2}}>
      <CardContent>
        <Typography variant="subtitle1">{friend.username}</Typography>
        <Typography variant="body1">{friend.online ? "online" : "offline"}</Typography>
      </CardContent>
      <CardActions>
        <Button>
          Manage
        </Button>
      </CardActions>
    </Card>)}
  </div>
}