import React, {useState, useEffect} from 'react'
import Bars from './Bars'
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import StorageIcon from '@mui/icons-material/Storage';
import {Outlet, useNavigate, Link, useLocation} from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import useStore from '../store'
import PeopleIcon from '@mui/icons-material/People';

export default function Wrapper() {
  let navigate = useNavigate()
  const {pathname} = useLocation()
  const loggedIn = useStore(store => store.loggedIn)
  const setLoggedIn = useStore(store => store.setLoggedIn)

  const title = "DIY Cloud Gaming"

  const auth = () => {
    setLoggedIn()
    navigate(`/`);
  }

  let appBarLinks = [
    <Button component={Link} to='/about' color="inherit">About</Button>
  ]
  appBarLinks = loggedIn ? [
    <Button component={Link} to="/" color="inherit">Dashboard</Button>,
    ...appBarLinks,
    <Button onClick={auth} color="inherit">Logout</Button>,
  ] : [
    <Button onClick={auth} color="inherit">Login</Button>,
    ...appBarLinks
  ]

  const aboutLinks = [
    {text: "About", to: "/about", icon: null},
    {text: "Notes", to: "/about/notes", icon: null},
    {text: "Streaming Setup", to: "/about/streaming-setup", icon: null},
    {text: "v2 (coming later)", to: "/about/v2", icon: null},
    {text: "Why DIY", to: "/about/why-diy", icon: null},
  ]
  const accountLinks = [
    {text: "Dashboard", to: "/", icon: <DashboardIcon />},
    {text: "Instances", to: "/instances", icon: <StorageIcon />},
    {text: "Account", to: "/account", icon: <AccountBoxIcon />},
    {text: "Friends", to: "/friends", icon: <PeopleIcon />}
  ]
  const sideBarLinksArray = pathname.includes('about') ? aboutLinks
    : loggedIn ? accountLinks : aboutLinks

  const sideBarLinks = sideBarLinksArray.map(({text, to, icon}, index) => (
    <ListItem key={text} disablePadding>
      <ListItemButton component={Link} to={to}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  ))

  return <Bars
    title={title}
    sideBarLinks={sideBarLinks}
    appBarLinks={appBarLinks}
  >
    <Outlet />
  </Bars>
}