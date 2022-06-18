import React, {useState, useEffect} from 'react'
import Drawer from 'components/Util/Drawer'
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LoginIcon from '@mui/icons-material/Login';
import Login from 'components/Auth'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import StorageIcon from '@mui/icons-material/Storage';
import {Outlet, useNavigate, Link, useLocation, Route, Routes} from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import useStore from 'store'
import PeopleIcon from '@mui/icons-material/People';
import {Auth} from "aws-amplify";
import {onError} from "lib/errors";
import ErrorBoundary from "components/Util/ErrorBoundary";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dashboard from "components/App/Dashboard";
import Instances from "components/App/Instances";
import Friends from "components/App/Friends";
import Account from "components/App/Account/Account";
// import Billing from "components/App/Account/Billing";
import Home from "components/About/Home";
import About from "components/About";
import NotFound from "components/NotFound";
import useCheckAuth from "./Auth/useCheckAuth";
import App from "./App";

const TITLE = "DIY Cloud Box"

export default function Index() {
  let nav = useNavigate()
  const {pathname} = useLocation()
  const authenticating = useCheckAuth()
  const authenticated = useStore(store => store.authenticated)
  const setAuthenticated = useStore(store => store.setAuthenticated)

  async function logout() {
    await Auth.signOut();
    setAuthenticated(false);
    nav("/login");
  }

  let appBarLinks = [
    <Button component={Link} to='/about' color="inherit">About</Button>
  ]
  appBarLinks = authenticated ? [
    <Button component={Link} to="/" color="inherit">Dashboard</Button>,
    ...appBarLinks,
    <Button onClick={logout} color="inherit">Logout</Button>,
  ] : [
    <Button component={Link} to="/auth" color="inherit">Login</Button>,
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
    {text: "Dashboard", to: "/", icon: <DashboardIcon/>},
    {text: "Instances", to: "/instances", icon: <StorageIcon/>},
    {text: "Account", to: "/account", icon: <AccountBoxIcon/>},
    {text: "Friends", to: "/friends", icon: <PeopleIcon/>}
  ]
  const sideBarLinksArray = pathname.includes('about') ? aboutLinks
    : authenticated ? accountLinks : aboutLinks

  const sideBarLinks = sideBarLinksArray.map(({text, to, icon}, index) => (
    <ListItem key={text} disablePadding>
      <ListItemButton component={Link} to={to}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text}/>
      </ListItemButton>
    </ListItem>
  ))

  function renderContent() {
    if (authenticating) {
      return null
    }
    // If we want redirect from unauth routes, see https://github.com/serverless-stack/demo-notes-app
    // Just gonna do hard-refresh for simplicity
    // return <AuthenticatedRoute><Settings /></AuthenticatedRoute>
    return <Routes>
      <Route path="about/*" element={<About />} />
      {authenticated ? <>
        <Route path="/*" element={<App />} />
      </> : <>
        <Route index element={<Home/>}/>
        <Route path="auth" element={<Login />} />
      </>}
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  }

  return <Drawer
    title={TITLE}
    sidebar={<>{sideBarLinks}</>}
    headerLinks={appBarLinks}
  >
    <ErrorBoundary>
      {renderContent()}
    </ErrorBoundary>
  </Drawer>
}