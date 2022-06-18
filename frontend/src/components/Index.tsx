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

const TITLE = "DIY Cloud Box"

function ContainerWithLinks() {
  let nav = useNavigate()
  const {pathname} = useLocation()
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

  return <Drawer
    title={TITLE}
    sideBarLinks={sideBarLinks}
    appBarLinks={appBarLinks}
  >
    <Outlet/>
  </Drawer>
}

function RoutesWrap() {
  const authenticated = useStore(store => store.authenticated)
  // If we want redirect from unauth routes, see https://github.com/serverless-stack/demo-notes-app
  // Just gonna do hard-refresh for simplicity
  // return <AuthenticatedRoute><Settings /></AuthenticatedRoute>
  return (
    <Routes>
      <Route path="/" element={<ContainerWithLinks />}>
        {authenticated ? <>
          <Route index element={<Dashboard/>}/>
          <Route path="instances">
            <Instances />
          </Route>
          <Route path="friends">
            <Friends />
          </Route>
          <Route path="account">
            <Route index element={<Account/>}/>
            {/*<Route path="billing" element={<Billing/>}/>*/}
          </Route>
        </> : <>
          <Route index element={<Home/>}/>
          <Route path="auth" element={<Login />} />
        </>}
        <Route path="about">
          <About />
        </Route>
      </Route>
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}

function AuthWrap() {
  const nav = useNavigate();
  const authenticating = useStore(store => store.authenticating)
  const setAuthenticating = useStore(store => store.setAuthenticating)
  const setAuthenticated = useStore(store => store.setAuthenticated)

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      setAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setAuthenticating(false);
  }

  return <>
    <ErrorBoundary>
      {authenticating ? <>
        <Typography variant="h1">Authenticating</Typography>
      </> : <>
        <RoutesWrap />
      </>}
    </ErrorBoundary>
  </>
}

export default AuthWrap