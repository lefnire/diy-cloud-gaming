import React from 'react'

import Grid from '@mui/material/Grid'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {CardHeader} from "@mui/material";
import Instances from './Instances/List'
import List from "./Friends/List";

interface Section {
  children: React.ReactElement
  title: string
}
function Section({children, title}: Section) {
  return <Grid item xs={12} lg={4}>
    <Card>
      <CardHeader title={title} />
      <CardContent>
        {children}
      </CardContent>
      <CardActions>
        <Button>Manage</Button>
      </CardActions>
    </Card>
  </Grid>
}

export default function Dashboard() {
  return <Grid container spacing={2}>
    <Section title="Running Costs">
      <div>
        <Typography variant="h2" color="primary">$235</Typography>
      </div>
    </Section>
    <Section title="Instances">
      <Instances />
    </Section>
    <Section title="Friends">
      <List />
    </Section>
  </Grid>
}