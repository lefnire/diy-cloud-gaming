import useStore from "../../store";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard";
import Instances from "./Instances";
import Friends from "./Friends";
import Account from "./Account/Account";
import React from "react";

export default function App() {
  return (
    <Routes>
      <Route index element={<Dashboard/>}/>
      <Route path="instances/*" element={<Instances />} />
      <Route path="friends/*" element={<Friends />} />
      <Route path="account/*" element={<Account />} />
    </Routes>
  );
}