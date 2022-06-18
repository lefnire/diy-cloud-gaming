import {Route} from "react-router-dom";
import ListFriends from "./List";
import AddFriend from "./Add";
import React from "react";

export default function Index() {
  return <>
    <Route index element={<ListFriends/>}/>
    <Route path="add" element={<AddFriend/>}/>
  </>
}