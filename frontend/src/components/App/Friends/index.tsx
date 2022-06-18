import {Route, Routes} from "react-router-dom";
import ListFriends from "./List";
import AddFriend from "./Add";
import React from "react";

export default function Index() {
  return <Routes>
    <Route index element={<ListFriends/>}/>
    <Route path="add" element={<AddFriend/>}/>
  </Routes>
}