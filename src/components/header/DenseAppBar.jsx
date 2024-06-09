import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router";
import axios from 'axios';
import Swal from 'sweetalert2';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

// import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';

// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './header.css'


import { constants } from "../../constants/constants.js"
import { getToken, removeTokenFromCookies } from "../../utils/functions.js";
import { Divider } from "@mui/material";

export default function DenseAppBar(props) {

  const navigate = useNavigate()

  const dispatch = useDispatch();
  const selector = useSelector(data => data.headerHeight);
  // const isMapUploadModal = useSelector(data => data.isMapUploadModal);
  // const [shouldMinimizeHeader, setShouldMinimizeHeader] = useState(false)


  const [headerHeight, setHeaderHeight] = useState(`${selector}`)
  // console.log("headerHeight:", headerHeight);


  const [isEmail, setIsEmail] = useState(false)

  useEffect(() => {
    setHeaderHeight(selector)
  }, [selector])

  const headerMinHeight = 10;
  const headerMaxHeight = 92;


  // console.log("headerHeight:", headerHeight);
  const [headerHover, setHeaderHover] = useState(false)

  const handleChangePage = (route, name) => {
    navigate(route)
    props.setPageName(name)
  }

  const handleShowHeaderWithButton = () => {
    if (headerHeight == headerMinHeight) {
      dispatch({
        type: "MAXIMIZEHEADER",
        value: headerMaxHeight
      })
    } else {
      dispatch({
        type: "MAXIMIZEHEADER",
        value: headerMinHeight
      })
    }
  }

  const handleMouseEnterOnHeader = (e) => {
    console.log("handleMouseEnterOnHeader");
    window.addEventListener('mousemove', handleMouseMove);
    // setShouldMinimizeHeader(false)
    dispatch({
      type: "MAXIMIZEHEADER",
      value: headerMaxHeight
    })

  }

  const handleMouseMove = (e) => {
    console.log("move");



    if (e.clientY >= headerMaxHeight) {
      console.log("asdfg");
      // setShouldMinimizeHeader(true)
      // setTimeout(() => {
      // if (shouldMinimizeHeader) {

      window.removeEventListener('mousemove', handleMouseMove);

      dispatch({
        type: "MINIMIZEHEADER",
        value: headerMinHeight
      })
      handleClose()
      // }
      // }, 2000);
    }
  }


  /////////////////////////
  // logout dropdown code
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMapImage = () => {
    navigate("/configuration", { state: { pageName: "dashboard" } });
    handleClose()
  }

  const handleLogout = async () => {
    const accessToken = getToken("accessToken")
    // const refreshToken = getToken("refreshToken")
    // console.log("accessToken:", accessToken);
    // dispatch({
    //   type: "USERAUTH",
    //   value: false,
    // })
    try {
      await axios.post(`${constants.nodeJsServer}/users/logout`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}` // Include token in Authorization header
        }
      });
      // Clear token from cookies and state upon successful logout
      removeTokenFromCookies()

      dispatch({
        type: "USERAUTH",
        value: null,
      })

    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async function downloadReport(selectedStartDate, selectedEndDate, selectedCamera, selectedType, selectedTypeText) {

    // console.log("selectedStartDate:", selectedStartDate);
    // console.log("selectedEndDate:", selectedEndDate);
    // console.log("selectedCamera:", selectedCamera);
    // console.log("selectedType:", selectedType);
    try {
      const response = await axios.get(`${constants.chartsDataIP}/stream/get_excel`, {
        params: {
          start_date: selectedStartDate,
          end_date: selectedEndDate,
          camera_name: selectedCamera,
          mode: selectedType,
        },
        headers: {
          accept: 'application/json',
        },
        responseType: 'blob',
      });

      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', selectedTypeText + '.xlsx');
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      return true;

    } catch (error) {
      console.log("error:", error);
      return false;
    }
  }

  async function sendEmailReport(selectedStartDate, selectedEndDate, selectedCamera, selectedType, email, selectedTypeText) {
    const accessToken = getToken("accessToken")

    // console.log("selectedStartDate:", selectedStartDate);
    // console.log("selectedEndDate:", selectedEndDate);
    // console.log("selectedCamera:", selectedCamera);
    // console.log("selectedType:", selectedType);

    // console.log("accessToken:", accessToken);

    try {
      const response = await axios.post(`${constants.nodeJsServer}/users/generateReportAndSendEmail`, {
        start_date: selectedStartDate,
        end_date: selectedEndDate,
        camera_name: selectedCamera,
        mode: selectedType,
        email: email, // Add email to the payload
        file_name: selectedTypeText,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      return true;

    } catch (error) {
      console.log("error:", error);
      return false
    }
  }

  const handleDownloadModal = async () => {
    const swalInstance = Swal.fire({
      title: 'Download Report',
      html: `
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <label class="leftAlign" for="startDate" style="width: 30%; height: 100%">Start Date:</label>
          <input type="date" style="width: 70%; margin: 0px" id="startDate" class="swal2-input">
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <label class="leftAlign" for="endDate" style="width: 30%; height: 100%">End Date:</label>
          <input type="date" style="width: 70%; margin: 0px" id="endDate" class="swal2-input">
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <label class="leftAlign" for="dropdown1" style="width: 30%; height: 100%">Select Camera:</label>
          <select id="dropdown1" style="width: 70%; margin: 0px; border: 1px solid lightgray" class="swal2-select">
            <option value="" disabled selected>Select Camera</option>
            <option value="all">All</option>
            <option value="camera_1">Camera 1</option>
            <option value="camera_2">Camera 2</option>
          </select>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <label class="leftAlign" for="dropdown2" style="width: 30%; height: 100%">Select Type:</label>
          <select id="dropdown2" style="width: 70%; margin: 0px; border: 1px solid lightgray" class="swal2-select">
            <option value="" disabled selected>Select Type</option>
            <option value="occupancy">${constants.option1}</option>
            <option value="integration">${constants.option2}</option>
          </select>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <label class="leftAlign" for="withEmail" style="width: 30%; height: 100%">Email:</label>
          <input id="withEmail" type="checkbox" style="width: 20px; height: 20px; margin: 0px" class="">
        </div>

        <div id="emailSection" style="display: none; align-items: center; margin-bottom: 10px">
          <label class="leftAlign" for="email" style="width: 30%; height: 100%">Email Address:</label>
          <input type="email" style="width: 70%; margin: 0px" id="email" class="swal2-input">
        </div>
        
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      // showDenyButton: true,
      // denyButtonText: `Send Email`,
      allowOutsideClick: () => false,
      showLoaderOnConfirm: true,
      // didDestroy: () => {
      //   document.getElementById('withEmail').removeEventListener('change', handleCheckboxChange);
      // },
      preConfirm: async (result) => {
        // console.log("in preconfirm:");
        const selectedStartDate = document.getElementById('startDate').value;
        const selectedEndDate = document.getElementById('endDate').value;
        const selectedCamera = document.getElementById('dropdown1').value;
        const selectedType = document.getElementById('dropdown2').value;
        const selectedTypeText = document.getElementById('dropdown2').options[document.getElementById('dropdown2').selectedIndex].text;
        const isEmail = document.getElementById('withEmail').checked;

        // Validate if any field is empty
        if (!selectedStartDate || !selectedEndDate || !selectedCamera || !selectedType) {
          return Swal.showValidationMessage("All fields are required");
        } else {
          console.log("after then");

          try {

            var email = document.getElementById('email').value;
            if (isEmail && !email.trim()) {

              // console.log("email is required");
              return Swal.showValidationMessage("Email address is required");

            }
            else if (isEmail && email.trim()) {

              // console.log("downloading the report and sending the email");
              // const downloadResponse = await downloadReport(selectedStartDate, selectedEndDate, selectedCamera, selectedType, selectedTypeText)
              // console.log("downloadResponse:", downloadResponse);

              const emailResponse = await sendEmailReport(selectedStartDate, selectedEndDate, selectedCamera, selectedType, email, selectedTypeText)
              // console.log("email resonse:", emailResponse);

              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Email sent successfully",
                // footer: '<a href="#">Why do I have this issue?</a>'
              }).then((result) => {

                Swal.update({ showConfirmButton: false });
                Swal.close();

              })

            }
            else if (!isEmail) {
              // console.log("only downloading the report");
              const downloadResponse = await downloadReport(selectedStartDate, selectedEndDate, selectedCamera, selectedType, selectedTypeText)
              // console.log("downloadResponse:", downloadResponse);

              Swal.update({ showConfirmButton: false });
              Swal.close();
            }

          } catch (error) {
            console.error('Error fetching data:', error.message);
            return Swal.showValidationMessage(`Request failed:  wrong`);
            // Swal.showValidationMessage(`Request failed: ${error.message}`);
          }
        }
      },
    }).then(async (result) => { });;

    // Define function to handle checkbox change
    const handleCheckboxChange = () => {
      let emailSection = document.getElementById('emailSection')
      // console.log("withEmailCheckbox:", document.getElementById('withEmail'));
      if (document.getElementById('withEmail').checked) {
        emailSection.style.display = 'flex';
      } else {
        emailSection.style.display = 'none';
      }
    };

    // Add event listener to the checkbox to toggle visibility of the email input field
    document.getElementById('withEmail').addEventListener('change', handleCheckboxChange);

    await swalInstance;
  };


  const setHeight = () => {
    dispatch({
      type: "MAXIMIZEHEADER",
      value: 50
    })
  }


  // const downloadPdf = () => {
  //   dispatch({
  //     type: "DOWNLOADPDFTRIGGERED",
  //     // value: headerMaxHeight
  //   })
  // }



  return (
    <Box
      sx={{ flexGrow: 1 }}
      className="headerDenseMain"
      style={{ height: `${headerHeight}px` }}
    // style={{ height: `60px` }}
    // onMouseEnter={(e) => handleMouseEnterOnHeader(e)}
    >
      <button className="showHeaderButton"
        style={{
          top: (headerHeight == headerMinHeight) ? '0px' : '90px',
          zIndex: '9999',
          display: (headerHeight == headerMinHeight) ? 'flex' : 'none'
        }}
      // onClick={handleShowHeaderWithButton}
      >
        <ion-icon style={{ fontSize: '35px' }} name="caret-down-outline"></ion-icon>
      </button>

      {/* <button onClick={setHeight}>setHeight</button> */}

      <AppBar position="static" className="headerDense"
        sx={{ display: `${headerHeight}px` != '92px' && 'block', height: "100%" }}
      // onMouseEnter={(e) => handleMouseEnterOnHeader(e)}
      >
        <Toolbar variant="dense" sx={{ height: "100%" }}
        // onMouseEnter={(e) => handleMouseEnterOnHeader(e)}
        >
          <IconButton
            edge="start"
            color="black"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={props.toggleDrawer("left", true)}
          >
            <MenuIcon />
          </IconButton>
          <Box className="logoBox">
            <img src="/images/logo.png" className="headerLogo" />
          </Box>

          <Box className="PagesNameParentDiv">
            <ul>
              <li onClick={() => handleChangePage("/", "PeopleAnalytics")} className={(props.pageName === "PeopleAnalytics") && "activePage"}>People Analytics</li>
            </ul>
          </Box>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* <Box className={"headerItem activePage"} onClick={handleDownloadModal}>
              Download
            </Box> */}

            <IconButton
              color="black"
              aria-label="Profile"
              onClick={handleClick}
            >
              <PersonIcon sx={{ fontSize: "25px" }} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleDownloadModal}>Download Report</MenuItem>
              <Divider />
              {/* <MenuItem onClick={() => downloadPdf()}>Download Charts</MenuItem> */}
              {/* <Divider /> */}
              <MenuItem onClick={handleMapImage}>Select Image</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
