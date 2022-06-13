import React, {useState} from 'react';
import Wrapper from './Drawer/Wrapper'
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import About from './loggedOut/About'
import Notes from './loggedOut/Notes'
import Home from './loggedOut/Home'
import ListInstances from './loggedIn/Instances/List'
import CreateInstance from './loggedIn/Instances/Create'
import Account from './loggedIn/Account/Account'
import Billing from './loggedIn/Account/Billing'
import Dashboard from './loggedIn/Dashboard'
import useStore from './store'
import StreamingSetup from './loggedOut/StreamingSetup'
import V2 from "./loggedOut/v2";
import WhyDIY from "./loggedOut/WhyDIY";
import ListFriends from "./loggedIn/Friends/List";
import AddFriend from "./loggedIn/Friends/Add";


function App() {
  const loggedIn = useStore(store => store.loggedIn)

  return <BrowserRouter>
    <CssBaseline />
    <Routes>
      <Route path="/" element={<Wrapper />}>
        {loggedIn ? <>
          <Route index element={<Dashboard />} />
          <Route path="instances">
            <Route index element={<ListInstances />} />
            <Route path="new" element={<CreateInstance  />} />
          </Route>
          <Route path="friends">
            <Route index element={<ListFriends />} />
            <Route path="add" element={<AddFriend />} />
          </Route>
          <Route path="account">
            <Route index element={<Account />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </> : <>
          <Route index element={<Home />} />
        </>}
        <Route path="about">
          <Route index element={<About />} />
          <Route path="notes" element={<Notes />} />
          <Route path="streaming-setup" element={<StreamingSetup />} />
          <Route path="v2" element={<V2 />} />
          <Route path="why-diy" element={<WhyDIY />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App;
