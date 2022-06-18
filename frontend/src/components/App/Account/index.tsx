import {Route, Routes} from "react-router-dom";
import React from "react";
import Account from './Account'

export default function Index() {
  return <Routes>
    <Route index element={<Account/>}/>
  </Routes>
}