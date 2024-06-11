import React from "react";
import { Routes, Route } from "react-router-dom";

import ErrorPage from "../../views/Error/ErrorPage";
import PeopleAnalyticsV3 from "../../views/PeopAnalytics/PeopleAnalyticsV3.jsx";

function Routing() {

  return (
    <>
      <Routes>
        <Route path="/" element={<PeopleAnalyticsV3 />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );

}

export default Routing;
