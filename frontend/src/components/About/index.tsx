import {Route} from "react-router-dom";
import About from "./About";
import Notes from "./Notes";
import StreamingSetup from "./StreamingSetup";
import V2 from "./v2";
import WhyDIY from "./WhyDIY";
import React from "react";

export default function Index() {
  return <>
    <Route index element={<About/>}/>
    <Route path="notes" element={<Notes/>}/>
    <Route path="streaming-setup" element={<StreamingSetup/>}/>
    <Route path="v2" element={<V2/>}/>
    <Route path="why-diy" element={<WhyDIY/>}/>
  </>
}