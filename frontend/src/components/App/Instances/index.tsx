import {Route} from "react-router-dom";
import ListInstances from "./List";
import CreateInstance from "./Create";
import React from "react";

export default function Index() {
  return <>
    <Route index element={<ListInstances/>}/>
    <Route path="new" element={<CreateInstance/>}/>
  </>
}