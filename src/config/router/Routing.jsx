import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Header from "../../components/header/index.jsx";
import Login from "../../views/Login/Login.jsx";

import ErrorPage from "../../views/Error/ErrorPage";
import Configuration from "../../views/Configuration/Configuration.jsx";
import { getToken } from "../../utils/functions.js";
// import PeopleAnalyticsV2 from "../../views/PeopAnalytics/PeopleAnalyticsV2.jsx";
import Signup from "../../views/Signup/Signup.jsx";
import PeopleAnalyticsV3 from "../../views/PeopAnalytics/PeopleAnalyticsV3.jsx";

function Routing() {

  // const user = useSelector(data => data.user);
  // const dispatch = useDispatch();
  // const [isUserLoggedIn, setIsUserLoggedIn] = useState(user.isLoggedIn);


  // useEffect(() => {
  //   setIsUserLoggedIn(user.isLoggedIn)
  // }, [user])

  // useEffect(() => {
  //   const accessToken = getToken("accessToken")
  //   if (accessToken) { }
  //   else {
  //     dispatch({
  //       type: "USERAUTH",
  //       value: false,
  //     })
  //   }
  // }, [])

  // if (isUserLoggedIn) {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<PeopleAnalyticsV3 />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );

  //   } else {
  //     return (
  //       <>
  //         <Routes>
  //           <Route path="/" element={<Login />} />
  //           <Route path="/login" element={<Login />} />
  //           <Route path="/signup" element={<Signup />} />
  //           <Route path="*" element={<ErrorPage />} />
  //         </Routes>
  //       </>
  //     );
  //   }
}

export default Routing;
