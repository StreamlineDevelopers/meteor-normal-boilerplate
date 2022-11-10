import React from "react";
import { BrowserRouter as Router,  Routes, Route } from "react-router-dom";

import App from "../../ui/App";

export default (
   <Router>
     <Routes>
        <Route path='/:component/:data' element={<App/>} />
        <Route path='/:component' element={<App/>} />
        <Route path='/' element={<App/>} />
    </Routes>
   </Router>
)
