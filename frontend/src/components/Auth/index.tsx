import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Login from './Login'
import Register from './Signup'

export default function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box hidden={value !== 0} sx={{p:3}}>
        <Login />
      </Box>
      <Box hidden={value !== 1} sx={{p:3}}>
        <Register />
      </Box>
    </Box>
  );
}