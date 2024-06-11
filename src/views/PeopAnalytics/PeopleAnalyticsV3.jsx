import React, { useEffect, useMemo, useState } from 'react'
import { constants } from '../../constants/constantsV3'

import { Box, FormControl, FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
// import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import CircularProgress from "@mui/material/CircularProgress";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// import PlotlyDonut from '../../components/PlotlyCharts/PlotlyDonut.jsx';
import DateSelector from "../../components/DateSelector/DateSelector.jsx";
import GenderCard from "../../components/GenderCard/GenderCard.jsx";
// import PlotlyGroupedBarChart from "../../components/PlotlyCharts/PlotlyGroupBarChart.jsx";
import Map from "../../components/leafletMap/Map.jsx";

import femalIcon from "./images/female.png";
import maleIcon from "./images/male.png";
import multipleUserIcon from "./images/maleFemaleGroup.png";
import foreignerIcon from "/images/foreignerIcon.png"
import liveCount from "/images/liveCount.svg"
import view3 from "./videos/view3.mp4"
import "./PeopleAnalyticsV3.css"
import axios from 'axios';
import AreaChart from '../../components/charts/AreaChart.jsx';
import TrendCard from '../../components/trendCard/TrendCard.jsx';
import GoogelMapComponent from '../../components/googleMap/GoogelMapComponent.jsx';
import Swal from 'sweetalert2';

const PeopleAnalyticsV3 = () => {


  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [selectedCamera, setSelectedCamera] = useState("camera1")
  const [cameraIndex, setCameraIndex] = useState(0);
  const [isView3, setIsView3] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);

  const [isView3VideoPlayed, setIsView3VideoPlayed] = useState(false);
  const [enabledDates, setEnabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);

  const [sideBarItems, setSideBarItems] = useState([
    { index: 1, active: true },
    { index: 2, active: false },
    { index: 3, active: false },
    // { index: 4, active: false },
  ]);

  const [markersPosition, setMarkersPosition] = useState([
    {
      name: "Camera1",
      position: [0.6, 0.58],
      isActive: true,
    },
    {
      name: "Camera2",
      position: [0.3, 0.82],
      isActive: false,
    },
    {
      name: "Camera3",
      position: [0.7, 0.85],
      isActive: false,
    },
  ]);
  const [googleMarkerPositions, setGoogleMarkerPositions] = useState([
    { lat: 17.479620144756336, lng: 44.178665091706534, label: "", title: "Camera 1", isActive: true },
    { lat: 17.48264315972698, lng: 44.18109734406652, label: "", title: "Camera 2", isActive: false },
    { lat: 17.479198336896417, lng: 44.182392162567946, label: "", title: "Camera 3", isActive: false }
  ]);

  const [camera1StreamInfo, setCamera1StreamInfo] = useState({
    stream: null,
    data: null
  })

  const [camera2StreamInfo, setCamera2StreamInfo] = useState({
    stream: null,
    data: null
  })

  const [historyDate, setHistoryDate] = useState({
    startDate: null,
    endDate: null,
    selectedDate: null,
  });

  const [groupChartData, setGroupChartData] = useState({
    data: [
      {
        x: [],
        y: [],
        name: 'Male',
        type: 'bar',
        marker: { color: '#952D98' }
      }

    ],
    layout: {

      // barmode: 'group',
      title: {
        text: "Total Visitors",
        x: 0.5,
        y: 0.95,
        xanchor: 'left',
        yanchor: 'top',
        font: {
          size: 16,
          color: '#263238',
          family: 'Roboto',
          weight: 'bold',
        },
      },
      margin: {
        autoexpand: true,
        l: 40,
        t: 30,
        b: 20,
        r: 0,
        pad: 0
      },
      autosize: true,
      hovermode: 'x unified',
      legend: {
        orientation: 'h',
      },
      xaxis: {
        automargin: true,
        range: [0, 23], // Fixed x-axis range from 0 to 23
        fixedrange: true, // Allow panning and zooming

      },
      yaxis: {
        fixedrange: true, // Disable zooming along the y-axis
      }

    },
    series: [],
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
        // height: "100%"
      },
      title: {
        // text: "2024-01-10",
        text: String(selectedDate),
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: undefined,
          color: '#263238'
        },
      },
      colors: ['#2A6EBB', '#ff00ff'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [],
        labels: {

          formatter: function (value) {
            return value + "hr"
          }
        }
      },
      yaxis: {
        title: {
          text: 'Count'
        }
      },
      fill: {
        opacity: 1
      }
    }
  });

  const [historyData, setHistoryData] = useState({
    approx_count_side_1_M: [],
    approx_count_side_1_F: [],
    approx_count_side_2_M: [],
    approx_count_side_2_F: [],
    side_1_M: [],
    side_1_F: [],
    side_2_M: [],
    side_2_F: [],
    categories: [],
    jsonData: [],
    female_total_count: 0,
    male_total_count: 0,
    selected_date: null,
  })

  const [time, setTime] = useState(new Date());

  useMemo(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(intervalId);
  }, []);
  // Empty dependency array to run this effect only once on component mount


  const handleSelectSideBarItem = (e, from) => {
    const index = from === "dropdown" ? e.target.value : e;

    // Update camera index and selected camera
    setCameraIndex(index);
    setSelectedCamera("camera" + (Number(index) + 1));

    // Helper function to update items
    const updateItems = (items, idx, key) => {
      return items.map((item, i) => ({ ...item, [key]: i === idx }));
    };

    // Update side bar items
    setSideBarItems(prevItems => updateItems(prevItems, index, "active"));

    // Update marker positions based on source
    // if (from === "googleMap") {
    //   setGoogleMarkerPositions(prevPositions => updateItems(prevPositions, index, "isActive"));
    // } else {
    setMarkersPosition(prevPositions => updateItems(prevPositions, index, "isActive"));
    setGoogleMarkerPositions(prevPositions => updateItems(prevPositions, index, "isActive"));
    // }

    // Handle view state for index 2
    if (index === 2) {
      setTimeout(() => {
        setIsView3(true);
        setIsView3VideoPlayed(true);
      }, 500);
    } else {
      setIsView3(false);
      setIsView3VideoPlayed(false);
    }
  };



  const handleGeneratePdf = async (date) => {
    try {
      setIsPdfDownloading(true)
      const url = `${constants.historicDataIP}/stream/download_pdf`;
      const params = { date_select: date };
      const headers = { accept: 'application/json' };
      const response = await axios.get(url, { params, headers, responseType: 'blob' });


      if (response.headers['content-type'] === 'application/pdf') {

        // PDF successfully generated, initiate download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'people_analytics_report.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      }

      setIsPdfDownloading(false)
      return true;

    } catch (error) {
      setIsPdfDownloading(false)
      console.log("error:", error);
      return false;
    }
  }

  const handleDateChange = (date) => {
    // console.log("in handleDateChange");
    const selectedDate = date.format("DD-MM-YYYY");
    console.log("selectedDate:", selectedDate);

    setSelectedDate([selectedDate])


    Swal.fire({
      title: "Want to download the report?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "#44C8F5",
      showCancelButton: true,
      confirmButtonColor: "#952D98",
      cancelButtonColor: "#808285",
      confirmButtonText: "Download"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("confirmed");
        handleGeneratePdf(selectedDate);
      }
    });

    // const url = `${constants.historicDataIP}/stream/get_total_counts`;
    // const params = { date_select: selectedDate };
    // const headers = { accept: 'application/json' };

    // axios.get(url, { params, headers })
    //   .then(response => {
    //     console.log(response.data);

    //     let hours = response.data.hours;
    //     let counts = response.data.counts;


    //     const minLength = 6;

    //     // Fill x values with default hour values if less than minLength
    //     const filledXValues = hours.length >= minLength
    //       ? hours
    //       : [...hours, ...Array.from({ length: minLength - hours.length }, (_, i) => String((hours.length + i) % 24).padStart(2, '0'))];

    //     // Fill y values with zeroes if less than minLength
    //     const filledYValues = counts.length >= minLength
    //       ? counts
    //       : [...counts, ...Array(minLength - counts.length).fill(0)];

    //     setGroupChartData(prevState => ({
    //       ...prevState,
    //       data: [
    //         {
    //           ...prevState.data[0], // Keep other properties of the first trace
    //           x: filledXValues,
    //           y: filledYValues,
    //         }
    //       ]
    //     }));




    //   })
    //   .catch(error => {
    //     console.error('There was an error!', error);
    //   });
  }

  const [areaChartData, setAreaChartData] = useState({
    hours: [],
    males: [],
    females: []
  });
  const [trendCardData, setTrendCardData] = useState({
    totalVisitors: 0,
    slope: 0,
    hours: [],
    counts: [],
    date: null,
    lastHourCount: 0
  })
  function fetchGetTotalVisitorsCountApi() {
    const url = `${constants.historicDataIP}/stream/get_total_counts`;
    // const params = { date_select: selectedDate };
    const params = {};
    const headers = { accept: 'application/json' };

    axios.get(url, { params, headers })
      .then(response => {

        let hours = response.data.hours;
        let counts = response.data.counts;
        let slope = response.data.slope;
        let date = response.data.date;
        let lastHourCount = 0

        if (counts.length > 1) {
          lastHourCount = counts[counts.length - 1]
        } else {
          lastHourCount = 0
        }



        setTrendCardData({
          totalVisitors: counts.reduce((acc, curr) => acc + curr, 0),
          slope: slope,
          hours: hours,
          counts: counts,
          date: date,
          lastHourCount: lastHourCount
        })





      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  const fetchDataForAreaChart = () => {
    const url = `${constants.historicDataIP}/stream/gender_hourly_counts`;
    const params = { date_select: selectedDate };
    const headers = { accept: 'application/json' };

    axios.get(url, { params, headers })
      .then(response => {
        let hours = response.data.hours;
        let males = response.data.male;
        let females = response.data.female;

        // console.log("hours:", hours);
        // console.log("males:", males);
        // console.log("females:", females);

        setAreaChartData({
          hours: hours,
          males: males,
          females: females
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    const fetchHistoricData = () => {
      // if (constants.streaming) {
      fetchDataForAreaChart();
      fetchGetTotalVisitorsCountApi();
      // }
    };

    fetchHistoricData();
    const intervalId = setInterval(fetchHistoricData, constants.apiCallInterval); // Fetch every 1 minute (60000 ms)

    return () => clearInterval(intervalId);
  }, []);



  const [controller1, setController1] = useState(new AbortController());
  const [controller2, setController2] = useState(new AbortController());

  const baseUrl8000 = constants.cam1IP;
  const baseUrl8001 = constants.cam2IP;

  useEffect(() => {
    const cameraUrl = [
      (constants.camera_1_live) ? `${baseUrl8000}/stream/video_feed` : `${baseUrl8000}/stream/video_feed_1`,
      (constants.camera_2_live) ? `${baseUrl8001}/stream/video_feed` : `${baseUrl8001}/stream/video_feed_2`,
    ];

    const fetchData = async () => {
      if (constants.streaming) {
        fetchVideoStream1(cameraUrl[0], controller1);
        // fetchVideoStream2(cameraUrl[1], controller2);
      }
    };

    fetchData();

    const cleanup = () => {
      controller1.abort();
      controller2.abort();
    };


    return () => {
      cleanup();
    };

  }, []);

  const fetchVideoStream1 = async (camUrl, controller) => {
    console.log(" in fetchVideoStream1");

    try {
      let jsonData = ""

      const response = await fetch(camUrl, { signal: controller.signal });
      const reader = response.body.getReader();
      let imageData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const parts = new TextDecoder("utf-8").decode(value).split("\r\n\r\n");

        parts.map((e, j) => {
          if (e.startsWith("--frame\r\nContent-Type: image/jpeg")) {
          }
          else if (e.startsWith("/9j")) {
            imageData = e
          }
          else if (e.startsWith("--frame\r\nContent-Type: application/json")) {
          }
          else if (e.startsWith("[{\"image\"")) {

            try {
              jsonData = JSON.parse(e)
              console.log("jsonData:", jsonData[0]);
              // console.log(json.length);
              let base64Img = "data:image/png;base64, " + imageData;
              setCamera1StreamInfo({
                stream: base64Img,
                data: jsonData
              })

              imageData = "";
            } catch (error) {
              console.info(error)
              imageData = "";
            }
          }
          else if (e.trim() == "[]") { }
          else if (e.trim() == "") { }
          else { imageData += e }


        })

      }
    } catch (error) {
      console.log("in catch");
      console.log(error);
      if (error.name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.error("Error:", error.message);
      }
    }

    console.log("got the data for previous intersection count");

  };



  return (
    <main >
      <header >
        <div className='headerLeftDiv'>
          <img className='headerLogo' src="/images/elm_logo.png" alt="logo" />
          {/* <span className='headerLogoTitle'>Elm Research Center</span> */}
        </div>
        <div className='headerRightDiv' style={{ background: constants.headerFooterColor }}>
          <div className='headerRightDivWebsiteName'>
            <div className='headerMainHeading'>
              People Analytics
            </div>
            <p className='headerSubHeading'>Elm Research Center</p>
          </div>
          {/* <div className='headerRightDateDiv'></div> */}
        </div>
      </header>

      <div style={{ position: "relative", height: "calc(100vh - 62px)", display: "flex", flexDirection: "column", gap: 5, padding: 5 }}>
        {/* <Box className="settingsIconBox" sx={{ right: 15, bottom: 10, }}>
          {
            isPdfDownloading ?
              (
                <>
                  <CircularProgress size={60} thickness={2} sx={{ position: "absolute", color: "#952D98" }} />
                  <PictureAsPdfIcon className="pdfIcon" sx={{ fontSize: 40, opacity: 0.6 }} />
                </>
              ) :
              (
                <>
                  <PictureAsPdfIcon className="pdfIcon" sx={{ fontSize: 40, opacity: 0.6 }} onClick={handleGeneratePdf} />
                </>
              )
          }

        </Box> */}

        <div style={{ height: "50%" }}>

          <div className="PARightBoxChartsLeft" style={{ height: `100%`, display: "flex", gap: 10 }} >
            <div style={{
              width: "180px", borderRadius: 10,
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
              // overflowY: "scroll", overflowX: "hidden"
            }}>
              <div className="PASideBarTopBox1" style={{ borderRadius: "10px", height: "100%", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  // border: "2px solid",
                  width: "90%",
                  position: "relative"
                }}>
                  <label htmlFor="siteName" style={{ position: "absolute", left: 2, top: -8, fontSize: 10, fontFamily: "Roboto", fontWeight: "bold", color: "#952D98" }}>SITE NAME</label>
                  <FormControl sx={{ m: 0, minWidth: 0, width: "100%" }}>
                    <Select
                      id='siteName'
                      value={"najran"}
                    // onChange={(e) => handleSelectSideBarItem(e, "dropdown")}
                    // displayEmpty
                    // inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="najran">Najran</MenuItem>
                      {/* <MenuItem value={1}>Site B</MenuItem> */}
                      {/* <MenuItem value={2}>Site C</MenuItem> */}
                    </Select>
                  </FormControl>
                </div>
                {sideBarItems.map((item, index) => (
                  <div
                    key={item + "_" + index}
                    className={`PASideBarItem ${item["active"] && "active"}`}
                    style={{ flex: "initial", height: 60, width: "90%" }}
                    onClick={() => handleSelectSideBarItem(index)}
                  >
                    <div className="PASideBarItemIconBox">
                      <VideoCameraBackIcon style={{ fontSize: "30px", color: item["active"] ? "#FF00FF" : "#2A6EBB" }}
                      />
                    </div>

                    <div className="">
                      Camera {item["index"]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* ------ IMAGE AND MAP AREA ------ */}
            <div className="PARightBoxChartsLeftCameraAndMap">

              {/* ---------- Video area ------------ */}
              <div className="imageParentBox" style={{ height: "100%" }}>
                {
                  isView3 ? (
                    isView3VideoPlayed ?
                      <video controls={false} width="100%" height="100%" autoPlay style={{ objectFit: "cover" }}>
                        <source src={view3} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video> :
                      <div className="loadingIndicator">
                        <PlayCircleIcon
                          onClick={() => { setIsView3VideoPlayed(true) }}
                          fontSize="large"
                          color="error"
                          sx={{ cursor: "pointer" }}
                        />
                      </div>
                  ) :

                    selectedCamera === "camera1" && camera1StreamInfo.stream ? (
                      <img src={camera1StreamInfo.stream} alt="Stream" className="streamImage" />
                    ) : selectedCamera === "camera2" && camera2StreamInfo.stream ? (
                      <img src={camera2StreamInfo.stream} alt="Stream" className="streamImage" />
                    ) : (!constants.streaming) ?
                      (
                        <div style={{ width: "100%", height: "100%", borderRadius: 20, display: "flex", justifyContent: "center", alignItems: "center", color: "gray", fontSize: 22 }}>
                          Stream is offline
                        </div>
                      ) : (
                        <div className="loadingIndicator">
                          <CircularProgress />
                          {/* <img src={camera1StreamInfo.stream} alt="Stream" className="streamImage" /> */}
                        </div>
                      )

                }
              </div>

              {/* ---------- OSM Map area ------------ */}
              <div className="mapParentBox" style={{ height: "100%" }}>
                {/* <Map
                  markersPosition={markersPosition}
                  setMarkersPosition={setMarkersPosition}
                  handleSelectSideBarItem={handleSelectSideBarItem}
                /> */}

                <GoogelMapComponent
                  googleMarkerPositions={googleMarkerPositions}
                  handleSelectSideBarItem={handleSelectSideBarItem}
                />
              </div>

              {/* Date Time and Date Selecter divs */}
              <div className="PARightBoxChartsRight" style={{ padding: '0px' }}>
                <div className="PAMostRigtTopBox" style={{ position: "relative", height: "100%", gap: 5 }}>

                  <div className="PAInfoCard" style={{ color: "#000", padding: 0, margin: 0, marginBottom: 0 }}>
                    <div style={{
                      textAlign: "center", fontWeight: "bold", fontSize: "1.8vw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                    }}>
                      {monthNames[time.getMonth()]} <br />{" "}
                      <span className="date"></span>
                      {time.getDate()}
                    </div>
                  </div>
                  <div className="PAInfoCard" style={{ color: "#000", padding: 0, margin: 0, marginBottom: 0 }}>
                    <div style={{
                      textAlign: "center", fontWeight: "bold", fontSize: "1.8vw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                    }}>
                      Time <br /> <span className="date"></span>
                      {time.toLocaleTimeString()}
                    </div>
                  </div>
                  {/* ********************** */}

                  {/* <FormControl sx={{ m: 0, minWidth: 0 }}>
                    <Select
                      value={cameraIndex}
                      onChange={(e) => handleSelectSideBarItem(e, "dropdown")}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={0}>Camera 1</MenuItem>
                      <MenuItem value={1}>Camera 2</MenuItem>
                      <MenuItem value={2}>Camera 3</MenuItem>
                    </Select>
                  </FormControl> */}
                  <DateSelector
                    dateType="selectedDate"
                    historyDate={historyDate}
                    // setHistoryDate={setHistoryDate}
                    enabledDates={enabledDates}
                    setEnabledDates={setEnabledDates}
                    // setSelectedDate={setSelectedDate}
                    cameraIndex={cameraIndex}
                    // groupChartData={groupChartData}
                    handleDataSelectorChange={handleDateChange}
                    historicDataIP={constants.historicDataIP}
                  />
                  {
                    isPdfDownloading &&
                    <CircularProgress size={35} thickness={3} sx={{ color: "#952D98", position: "absolute", bottom: 11, right: 12 }} />
                  }

                </div>

                {/* --------- Donot Chart AREA ---------- */}

                {/* --------- Donot Chart AREA ---------- */}
              </div>
            </div>
            {/* ------ IMAGE AND MAP AREA ------ */}

          </div>

        </div>



        <div style={{ height: "18%" }}>
          {/* Gender Cards Area */}
          <div className="PACenterBottomArea" style={{ height: "100%" }}>
            <div className="PACenterBottomAreadiv1" style={{ height: "100%" }}>

              <div className="PAGenderCardBox">
                <GenderCard
                  conditionText={"total"}
                  imgSrc={liveCount}
                  heading={constants.card4Text}
                  imgSrcLeft={femalIcon}
                  imgSrcRight={maleIcon}
                  imgLeftWidth={"2.6vw"}
                  imgRightWidth={"4.5vw"}
                  value={
                    (cameraIndex == 0) ?
                      (camera1StreamInfo.data && camera1StreamInfo?.data.length > 0) ? camera1StreamInfo.data[0].instant_count : 0
                      : 0
                  }
                />
              </div>
              <div className="PAGenderCardBox" >
                <GenderCard
                  heading={constants.card1Text}
                  imgSrcLeft={femalIcon}
                  imgSrcRight={maleIcon}
                  imgLeftWidth={"4vw"}
                  imgRightWidth={"4.5vw"}
                  leftText={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.female :
                      selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                        camera1StreamInfo.data[0].cumulative_gender.female :
                        0
                  }
                  rightText={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.male :
                      selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                        camera1StreamInfo.data[0].cumulative_gender.male :
                        0
                  }

                />
              </div>
              <div className="PAGenderCardBox">
                <GenderCard
                  // heading="Side 2"
                  heading={constants.card2Text}
                  imgSrcLeft={foreignerIcon}
                  imgSrcRight={maleIcon}
                  imgLeftWidth={"3vw"}
                  imgRightWidth={"4.5vw"}

                  leftText={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.local :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera1StreamInfo.data[0].cumulative_ethnicity.local :
                        0
                  }
                  rightText={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                        0
                  }
                />
              </div>
              <div className="PAGenderCardBox">
                <GenderCard
                  heading={constants.card3Text}
                  conditionText={"total"}
                  imgSrc={multipleUserIcon}
                  imgLeftWidth={"4vw"}
                  imgRightWidth={"4.5vw"}
                  value={
                    (cameraIndex == 0) ?
                      (camera1StreamInfo.data && camera1StreamInfo?.data.length > 0) ? camera1StreamInfo.data[0].cumulative_count : 0
                      : 0
                  }
                />
              </div>
              <div className="PAGenderCardBox" >
                <TrendCard
                  trendCardData={trendCardData}
                  cameraIndex={cameraIndex}
                />
              </div>

            </div>
          </div>
          {/* Gender Cards Area */}
        </div>




        <div style={{ height: "32%", transition: "height 2s ease-in-out" }}>
          <div className="PASideBarBottomBox"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div className="doughnutAndGroupBarChart"
              style={{
                height: "100%",
                display: "flex",
                gap: 10,
                justifyContent: "center"
              }}>


              {/* donut charts */}
              <div
                id="donutChart"
                className="doughtnut"
                style={{
                  margin: "0px",
                  width: "calc(50% - 10px)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  borderBottom: "3px solid #952D98",
                }}
              >

                <AreaChart title="MALE" type="male" chartData={areaChartData} cameraIndex={cameraIndex} />

                {/* <PlotlyDonut
                  tags={constants.doughnutChart1Tags}
                  upwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.male :
                      selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                        camera1StreamInfo.data[0].cumulative_gender.male :
                        0
                  }
                  upwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.female :
                      selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                        camera1StreamInfo.data[0].cumulative_gender.female :
                        0
                  }
                  downwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.male :
                      selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                        camera1StreamInfo.data[0].cumulative_gender.male :
                        0
                  }
                  downwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_gender.female :
                      selectedCamera === "camera2" && camera2StreamInfo.data && camera2StreamInfo.data.length >= 1 ?
                        camera1StreamInfo.data[0].cumulative_gender.female :
                        0
                  }
                  donutType="gender"

                  title={constants.side1Text}
                  headerHeight={heightOffset}
                  doughnut1Title={constants.doughnut1Title}
                  doughnut2Title={constants.doughnut2Title}
                  labelFontSize={constants.donutChartTitleFontSize}

                /> */}

                {/* <PlotlyDonut
                  tags={constants.doughnutChart2Tags}
                  upwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                        0
                  }
                  upwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.local :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera1StreamInfo.data[0].cumulative_ethnicity.local :
                        0
                  }
                  downwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera1StreamInfo.data[0].cumulative_ethnicity.non_local :
                        0
                  }
                  downwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data && camera1StreamInfo.data.length >= 1 ?
                      camera1StreamInfo.data[0].cumulative_ethnicity.local :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera1StreamInfo.data[0].cumulative_ethnicity.local :
                        0
                  }
                  donutType="ethnicity" // or "downward" based on your requirement
                  // title={constants.side2Text} // or "Side 2" based on your requirement
                  headerHeight={heightOffset}
                  doughnut1Title={constants.doughnut1Title}
                  doughnut2Title={constants.doughnut2Title}
                  labelFontSize={constants.donutChartTitleFontSize}
                /> */}


              </div>

              {/* donut charts */}

              {/* Group Bar Chart */}
              <div
                id="groupBarChart"
                style={{
                  boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  width: "calc(50% - 10px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  borderBottom: "3px solid #952D98"
                }}
              >
                {/* <div className="chart2" style={{ position: "relative", }}> */}


                <AreaChart title="FEMALE" type='female' chartData={areaChartData} cameraIndex={cameraIndex} />

                {/* <PlotlyGroupedBarChart
                    groupChartData={groupChartData}
                    setGroupChartData={setGroupChartData}
                    side={1}
                    historyData={historyData}
                    side1Text={constants.side1Text}
                    side2Text={constants.side2Text}
                  /> */}

                {/* </div> */}
              </div>
            </div>

          </div>
        </div>
      </div >
    </main >
  )
}

export default PeopleAnalyticsV3