import React, { useEffect, useMemo, useState, useRef } from "react";
import "./PeopleAnalyticsV1.css";
import { useSelector } from "react-redux";
import axios from 'axios';


import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SettingsIcon from '@mui/icons-material/Settings';

import Map from "../../components/leafletMap/Map.jsx";

import femalIcon from "./images/female.png";
import maleIcon from "./images/male.png";
import multipleUserIcon from "./images/maleFemaleGroup.png";
import GenderCard from "../../components/GenderCard/GenderCard.jsx";
import DateSelector from "../../components/DateSelector/DateSelector.jsx";
import { Box, FormControlLabel, Switch } from "@mui/material";
// import leapHeader from "./images/leap_header.png";
import view3 from "./videos/view3.mp4"
import PlotlyHeatmapChart from "../../components/PlotlyCharts/PlotlyHeatmapChart.jsx";
import PlotlyGroupedBarChart from "../../components/PlotlyCharts/PlotlyGroupBarChart.jsx";

import PlotlyDonut from '../../components/PlotlyCharts/PlotlyDonut.jsx'
import PlotlyPieChart from "../../components/PlotlyCharts/PlotlyPieChart.jsx";

import { constants } from "../../constants/constants.js"
import PlotlyOccupancyPieChart from "../../components/PlotlyCharts/PlotlyOccupancyPieChart.jsx";

import { filterDataForGivenTime, getOccupancyDataFromLocalStorage } from "../../utils/functions.js"
import SettingsPanel from "../../components/SettingsPanel/SettingsPanel.jsx";
// import ChartsModal from "../../components/ChartsModal/ChartsModal.jsx";



import generatePDF, { Resolution, Margin } from "react-to-pdf";

function PeopleAnalytics() {
  const selector = useSelector((data) => data.headerHeight);
  const [heightOffset, setHeightOffset] = useState(`${selector}`);
  const [chartsToggleState, setChartsToggleState] = useState({
    show: false,
    iconSize: "40px",
    settingPanelStatus: false,
    occupancyPieChart: true,
    heatmapChart: true,
    entryCountFemalesPieChart: true,
    entryCountMalesPieChart: true,
    exitCountFemalesPieChart: true,
    exitCountMalesPieChart: true
  });

  const lastChartDivRef = useRef()
  const TopLayerDiv = useRef()


  const handleScrollToBottom = (dir) => {

    if (dir == "moveDown") {
      setChartsToggleState((prev) => ({ ...prev, show: !prev.show }))
      setTimeout(() => {
        lastChartDivRef.current?.scrollIntoView({
          behavior: "smooth"
        })
      }, 100);

    } else if (dir == "moveUp") {

      TopLayerDiv.current?.scrollIntoView({
        behavior: "smooth"
      })
      setTimeout(() => {
        setChartsToggleState((prev) => ({ ...prev, show: !prev.show }))
      }, 500);
    }
  }

  const handleSettingPanel = () => {
    setChartsToggleState({ ...chartsToggleState, settingPanelStatus: !chartsToggleState.settingPanelStatus })
  }



  const baseUrl8000 = constants.camera_1_live ? constants.cam1IP : constants.preRecordedIP;
  const baseUrl8001 = constants.camera_2_live ? constants.cam2IP : constants.preRecordedIP;
  let baseurlCharts = constants.chartsDataIP;

  const [time, setTime] = useState(new Date());
  const [updateChartsCounter, setUpdateChartsCounter] = useState(0);


  useMemo(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
      setUpdateChartsCounter(prevCounter => prevCounter + 1);
    }, 1000); // Update time every second

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run this effect only once on component mount



  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  ////////////////////////////////////////////////////////////////////
  const [cameraIndex, setCameraIndex] = useState(1);
  const [enabledDates, setEnabledDates] = useState([]);
  const [defaultFilePath, setDefaultFilePath] = useState(null);
  const [selectedDate, setSelectedDate] = useState([]);
  const [historyDate, setHistoryDate] = useState({
    startDate: null,
    endDate: null,
    selectedDate: null,
  });
  const [groupChartData, setGroupChartData] = useState({
    data: [
      {
        x: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
        y: [1, 11, 5, 16, 18, 3, 5, 9, 1, 14, 11, 5, 16, 18, 3, 5, 9, 1, 14, 1, 18, 3, 5, 1],
        name: 'Male',
        type: 'bar',
        // color: '#2a6ebb',
        marker: { color: '#2a6ebb' }
      },
      {
        x: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
        y: [1, 5, 3, 18, 1, 14, 1, 9, 5, 3, 18, 16, 5, 3, 11, 14, 1, 9, 5, 3, 18, 16, 5, 11, 1],
        name: 'Female',
        type: 'bar',
        // color: '#ff00ff',
        marker: { color: '#ff00ff' }
      }
    ],
    layout: {

      barmode: 'group',
      title: {
        text: "Loading...",
        x: 0.5,
        y: 0.95,
        xanchor: 'left',
        yanchor: 'top',
        font: {
          size: 14,
          color: '#263238',
          family: undefined,
          weight: 'bold',
        },
      },
      margin: {
        autoexpand: true,
        l: 40,
        t: 30,
        b: 0,
        r: 0,
        pad: 0
      },
      autosize: true,
      hovermode: 'x unified',
      legend: {
        orientation: 'h',
      },

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
            // Display the extracted time directly without formatting

            const dateArray = value.split('-');
            const startHour = parseInt(dateArray[3]) + 3; // Use parseInt to convert the string to an integer            
            const endHour = startHour + 1;
            return `${startHour < 10 ? '0' + startHour : startHour}-${endHour < 10 ? '0' + endHour : endHour}`;
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
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      }
    }
  });
  // const [groupChartData, setGroupChartData] = useState({
  //   data: [],
  //   series: [],
  //   options: {
  //     chart: {
  //       type: 'bar',
  //       toolbar: {
  //         show: false
  //       }
  //       // height: "100%"
  //     },
  //     title: {
  //       // text: "2024-01-10",
  //       text: String(selectedDate),
  //       align: 'center',
  //       margin: 10,
  //       offsetX: 0,
  //       offsetY: 0,
  //       floating: false,
  //       style: {
  //         fontSize: '14px',
  //         fontWeight: 'bold',
  //         fontFamily: undefined,
  //         color: '#263238'
  //       },
  //     },
  //     colors: ['#2A6EBB', '#ff00ff'],
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         columnWidth: '55%',
  //         endingShape: 'rounded'
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     stroke: {
  //       show: true,
  //       width: 2,
  //       colors: ['transparent']
  //     },
  //     xaxis: {
  //       categories: [],
  //       labels: {
  //         formatter: function (value) {
  //           // Display the extracted time directly without formatting

  //           const dateArray = value.split('-');
  //           const startHour = parseInt(dateArray[3]) + 3; // Use parseInt to convert the string to an integer            
  //           const endHour = startHour + 1;
  //           return `${startHour < 10 ? '0' + startHour : startHour}-${endHour < 10 ? '0' + endHour : endHour}`;
  //         }
  //       }
  //     },
  //     yaxis: {
  //       title: {
  //         text: 'Count'
  //       }
  //     },
  //     fill: {
  //       opacity: 1
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: function (val) {
  //           return val;
  //         }
  //       }
  //     }
  //   }
  // });
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

  // this function is setting the history data i.e. setGroupChartData
  const fetchHistoryDataForGroupBarChartAndHistoryCharts = async () => {
    try {
      let filePath;
      let url;
      if (historyDate.selectedDate) {
        // If a date is selected, use the selected date's file path
        filePath = `${defaultFilePath}\\camera_${cameraIndex}\\${historyDate.selectedDate}_data.json`;
        url = `${baseurlCharts}/stream/get_data?file_path=${encodeURIComponent(filePath)}`;
        // console.log("if");
      } else {
        // If no date is selected, use the latest available data
        url = `${baseurlCharts}/stream/get_latest_file?camera_name=camera_${cameraIndex}`
        // console.log("else");
        // console.log(historyDate.selectedDate);
      }

      const response = await fetch(url);
      const jsonData = await response.json();
      // console.log("-0-0-0-0-");
      // console.log(jsonData);

      let display_date = jsonData[0]["date_"].split('-');
      display_date = display_date[0] + "-" + display_date[1] + "-" + display_date[2];

      // Process JSON data to extract categories and series
      const categories = jsonData.map(entry => entry.date_);
      const approx_count_side_1_M = jsonData.map(entry => entry[`approx_count_side_1_M`]);
      const approx_count_side_1_F = jsonData.map(entry => entry[`approx_count_side_1_F`]);
      const approx_count_side_2_M = jsonData.map(entry => entry[`approx_count_side_2_M`]);
      const approx_count_side_2_F = jsonData.map(entry => entry[`approx_count_side_2_F`]);
      const side_1_M = jsonData.map(entry => entry[`side_1_M`]);
      const side_1_F = jsonData.map(entry => entry[`side_1_F`]);
      const side_2_M = jsonData.map(entry => entry[`side_2_M`]);
      const side_2_F = jsonData.map(entry => entry[`side_2_F`]);
      const date = (jsonData.length > 0) && jsonData[0]['date_'].slice(0, -3);

      const female_total_count = historyData.side_1_F.reduce((total, current) => total + current, 0) +
        historyData.side_2_F.reduce((total, current) => total + current, 0);

      const male_total_count = historyData.side_1_M.reduce((total, current) => total + current, 0) +
        historyData.side_2_M.reduce((total, current) => total + current, 0);

      const approx_male_total_count = approx_count_side_1_M.reduce((total, current) => total + current, 0) +
        approx_count_side_2_M.reduce((total, current) => total + current, 0);

      const approx_female_total_count = approx_count_side_1_F.reduce((total, current) => total + current, 0) +
        approx_count_side_2_F.reduce((total, current) => total + current, 0);

      setHistoryData({
        approx_count_side_1_M: approx_count_side_1_M,
        approx_count_side_1_F: approx_count_side_1_F,
        approx_count_side_2_M: approx_count_side_2_M,
        approx_count_side_2_F: approx_count_side_2_F,
        side_1_M: side_1_M,
        side_1_F: side_1_F,
        side_2_M: side_2_M,
        side_2_F: side_2_F,
        categories: categories,
        jsonData: jsonData,
        female_total_count: female_total_count,
        male_total_count: male_total_count,
        approx_male_total_count: approx_male_total_count,
        approx_female_total_count: approx_female_total_count,
        selected_date: (historyDate.selectedDate) ? historyDate.selectedDate : date
      })

      localStorage.setItem("chartData", JSON.stringify({
        approx_count_side_1_M: approx_count_side_1_M,
        approx_count_side_1_F: approx_count_side_1_F,
        approx_count_side_2_M: approx_count_side_2_M,
        approx_count_side_2_F: approx_count_side_2_F,
        side_1_M: side_1_M,
        side_1_F: side_1_F,
        side_2_M: side_2_M,
        side_2_F: side_2_F,
        categories: categories,
        jsonData: jsonData,
        female_total_count: female_total_count,
        male_total_count: male_total_count,
        approx_male_total_count: approx_male_total_count,
        approx_female_total_count: approx_female_total_count,
        selected_date: (historyDate.selectedDate) ? historyDate.selectedDate : date
      }))


    } catch (error) {
      console.error("ErrorfetchHistoryDataForGroupBarChartAndHistoryCharts fetching error");
      console.error('Error fetching data:', error);


      const localStorageHistoryData = localStorage.getItem("chartData");
      if (localStorageHistoryData) {
        try {
          const { jsonData, selected_date } = JSON.parse(localStorageHistoryData);
          let display_date = jsonData[0]["date_"].split('-');
          display_date = display_date[0] + "-" + display_date[1] + "-" + display_date[2];

          // Process JSON data to extract categories and series
          const categories = jsonData.map(entry => entry.date_);
          const approx_count_side_1_M = jsonData.map(entry => entry[`approx_count_side_1_M`]);
          const approx_count_side_1_F = jsonData.map(entry => entry[`approx_count_side_1_F`]);
          const approx_count_side_2_M = jsonData.map(entry => entry[`approx_count_side_2_M`]);
          const approx_count_side_2_F = jsonData.map(entry => entry[`approx_count_side_2_F`]);
          const side_1_M = jsonData.map(entry => entry[`side_1_M`]);
          const side_1_F = jsonData.map(entry => entry[`side_1_F`]);
          const side_2_M = jsonData.map(entry => entry[`side_2_M`]);
          const side_2_F = jsonData.map(entry => entry[`side_2_F`]);



          const female_total_count = historyData.side_1_F.reduce((total, current) => total + current, 0) +
            historyData.side_2_F.reduce((total, current) => total + current, 0);

          const male_total_count = historyData.side_1_M.reduce((total, current) => total + current, 0) +
            historyData.side_2_M.reduce((total, current) => total + current, 0);

          const approx_male_total_count = approx_count_side_1_M.reduce((total, current) => total + current, 0) +
            approx_count_side_2_M.reduce((total, current) => total + current, 0);

          const approx_female_total_count = approx_count_side_1_F.reduce((total, current) => total + current, 0) +
            approx_count_side_2_F.reduce((total, current) => total + current, 0);




          // Update history data
          setHistoryData({
            approx_count_side_1_M,
            approx_count_side_1_F,
            approx_count_side_2_M,
            approx_count_side_2_F,
            side_1_M,
            side_1_F,
            side_2_M,
            side_2_F,
            categories,
            jsonData,
            female_total_count,
            male_total_count,
            display_date,
            approx_male_total_count,
            approx_female_total_count,
            selected_date
          });
        } catch (error) {
          console.error('Error parsing JSON from localStorage:', error);
        }
      } else {
        console.log('No data found in localStorage.');
      }
    }
  };

  const [chartUpdateFlag, setChartUpdateFlag] = useState(false)

  useEffect(() => {
    if (updateChartsCounter % constants.chartUpdateInterval == 0) {
      fetchHistoryDataForGroupBarChartAndHistoryCharts();

      setChartUpdateFlag(!chartUpdateFlag);
    }

  }, [updateChartsCounter]);


  useEffect(() => {
    if (cameraIndex != 3) {
      fetchHistoryDataForGroupBarChartAndHistoryCharts();
    }
  }, [historyDate.selectedDate, enabledDates, cameraIndex])




  //////////////  Getting Data For Occupancy Bar Chart ////////////

  const [occupancyPieChartData, setOccupancyPieChartData] = useState({
    occupancyCounts: [],
    hours: [],
    selectedDate: null
  })

  useEffect(() => {
    const fetchData = async () => {

      let { selectedDate } = historyDate
      let defaultDate = null;
      let url = `${baseUrl8000}/stream/get_occ_data_of_current_date?camera_name=camera_${cameraIndex}`;

      if (selectedDate) {
        url += `&date_select=${selectedDate}`;
      }
      try {
        const response = await axios.get(url);
        const { success, data } = response.data;

        // console.log("response=>", response.data);


        if (success && Array.isArray(data)) {
          const occupancyCounts = data.map(item => item.approx_count);
          // const occupancyCounts = data.map(item => item.Count);

          if (!selectedDate) {
            defaultDate = data[0]["date_"].slice(0, -3);
          }


          let dateWithTime = data.map((item) => item.date_)
          let { hours, counts } = filterDataForGivenTime(dateWithTime, occupancyCounts);

          setOccupancyPieChartData({
            occupancyCounts: counts,
            hours: hours,
            // selectedDate: selectedDate ? selectedDate : new Date().toISOString().split('T')[0],
            selectedDate: selectedDate ? selectedDate : defaultDate,
          });


        } else {
          console.error('NO Data Found for get_occ_data_of_current_date api');
          // console.error(response.data);

          const { occupancyCounts, hours, selectedDate } = getOccupancyDataFromLocalStorage();
          setOccupancyPieChartData({ occupancyCounts, hours, selectedDate });

        }
      } catch (error) {
        console.error('Error fetching data:', error);

        const { occupancyCounts, hours, selectedDate } = getOccupancyDataFromLocalStorage();
        setOccupancyPieChartData({ occupancyCounts, hours, selectedDate });
      }

    };

    if (cameraIndex == 1 || cameraIndex == 2) {
      fetchData();
    } else {
      console.log("in plotly bar chart cam: other than 1 and 2");
    }
  }, [cameraIndex, historyDate.selectedDate, chartUpdateFlag]);
  //////////////  Getting Data For Occupancy Bar Chart ////////////



  const [isView3, setIsView3] = useState(false);
  const [isView3VideoPlayed, setIsView3VideoPlayed] = useState(false);


  // const [markersPosition, setMarkersPosition] = useState([
  //   {
  //     name: "Camera1",
  //     // position: [24.6402, 46.7118],
  //     position: [0.5, 0.5],
  //     isActive: true,
  //   },
  //   {
  //     name: "Camera2",
  //     // position: [24.6742, 46.7142],
  //     position: [1.3, 0.6],
  //     isActive: false,
  //   },
  //   {
  //     name: "Camera3",
  //     // position: [24.6292, 46.6799],
  //     position: [0.7, 1.1],
  //     isActive: false,
  //   },
  // ]);

  const [markersPosition, setMarkersPosition] = useState([
    {
      name: "Camera1",
      // position: [24.6402, 46.7118],
      position: [0.5, 0.28],
      isActive: true,
    },
    {
      name: "Camera2",
      // position: [24.6742, 46.7142],
      position: [0.6, 0.6],
      isActive: false,
    },
    {
      name: "Camera3",
      // position: [24.6292, 46.6799],
      position: [0.7, 1.02],
      isActive: false,
    },
  ]);

  const [selectedCamera, setSelectedCamera] = useState("camera1")


  const [sideBarItems, setSideBarItems] = useState([
    { index: 1, active: true },
    { index: 2, active: false },
    { index: 3, active: false },
    // { index: 4, active: false },
  ]);
  const [currentSide, setCurrentSide] = useState(1); // Default to side 1
  const toggleSide = () => {
    setCurrentSide((current) => (current === 1 ? 2 : 1)); // Toggle between side 1 and side 2
  };

  const [heatMapDirectionToggle, setHeatMapDirectionToggle] = useState(1); // Default to side 1
  const toggleHeatMap = () => {
    setHeatMapDirectionToggle((current) => (current === 1 ? 2 : 1)); // Toggle between side 1 and side 2
  };

  const [camera1StreamInfo, setCamera1StreamInfo] = useState({
    stream: null,
    data: null
  })

  const [camera2StreamInfo, setCamera2StreamInfo] = useState({
    stream: null,
    data: null
  })

  const [controller1, setController1] = useState(new AbortController());
  const [controller2, setController2] = useState(new AbortController());


  const handleSelectSideBarItem = (index) => {
    setHistoryDate({ ...historyDate, selectedDate: null })
    setCameraIndex(index + 1);
    setSelectedCamera("camera" + (Number(index) + 1));


    let tempSideBarItems = sideBarItems.map((item) => {
      return { ...item, active: false };
    });
    tempSideBarItems[index].active = true;
    setSideBarItems(tempSideBarItems);

    let tempMarkersPosition = markersPosition.map((item) => {
      return { ...item, isActive: false };
    });
    tempMarkersPosition[index].isActive = true;
    setMarkersPosition(tempMarkersPosition);



    if (index === 2) {
      setTimeout(() => {
        setIsView3(true);
        setIsView3VideoPlayed(true)
      }, 500);

    } else {
      setIsView3(false);
      setIsView3VideoPlayed(false);

      // fetchVideoStream(cameraUrl[index]);
    }
  };



  useEffect(() => {
    const cameraUrl = [
      (constants.camera_1_live) ? `${baseUrl8000}/stream/video_feed/` : `${baseUrl8000}/stream/video_feed_1/`,
      (constants.camera_2_live) ? `${baseUrl8001}/stream/video_feed/` : `${baseUrl8001}/stream/video_feed_2/`,
    ];

    const fetchData = async () => {
      if (constants.streaming) {
        fetchVideoStream1(cameraUrl[0], controller1);
        fetchVideoStream2(cameraUrl[1], controller2);
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
    console.log(camUrl);


    try {
      // const oldDataResponse = await fetch(`${baseUrl8000}/stream/get_constant?camera_name=camera_0`);
      // const oldData = await oldDataResponse.json();

      // console.log("oldData:", oldData);

      let jsonData = ""

      const response = await fetch(camUrl, { signal: controller.signal });
      const reader = response.body.getReader();
      let imageData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const parts = new TextDecoder("utf-8").decode(value).split("\r\n\r\n");

        if (parts.length == 2) {
          imageData += parts[1];
        } else if (parts.length == 1) {
          imageData += parts[0];
        } else if (parts.length == 4) {
          try {
            // let jsonData = JSON.parse(parts[2]);
            let temp = JSON.parse(parts[2]);
            if (temp.side_1 == undefined) {

            } else {

              // temp = {
              //   ...temp,
              //   side_1_F: oldData.side_1_F + temp.side_1_F,
              //   side_1_M: oldData.side_1_M + temp.side_1_M,
              //   side_2_F: oldData.side_2_F + temp.side_2_F,
              //   side_2_M: oldData.side_2_M + temp.side_2_M,
              // }
              // jsonData = temp
              jsonData = temp
            }

            imageData += parts[0];
            if (!parts[0].startsWith("--frame")) {
              let base64Img = "data:image/png;base64, " + imageData;

              setCamera1StreamInfo({
                stream: base64Img,
                data: jsonData

              })
            }
            imageData = "";

          } catch (error) {
            console.log("Error parsing JSON data 1");
          }


        } if (parts.length == 5) {

          try {
            // let jsonData = JSON.parse(parts[3]);
            let temp = JSON.parse(parts[3]);
            if (temp.side_1 == undefined) {
            } else {


              temp = {
                ...temp,
                side_1_F: oldData.side_1_F + temp.side_1_F,
                side_1_M: oldData.side_1_M + temp.side_1_M,
                side_2_F: oldData.side_2_F + temp.side_2_F,
                side_2_M: oldData.side_2_M + temp.side_2_M,
              }
              jsonData = temp
            }

            imageData += parts[1];
            if (!parts[1].startsWith("--frame")) {
              let base64Img = "data:image/png;base64, " + imageData;

              setCamera1StreamInfo({
                stream: base64Img,
                data: jsonData

              })
            }
            imageData = "";

          } catch (error) {
            console.log("Error parsing JSON data");
          }

        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.error("Error:", error.message);
      }
    }

    console.log("got the data for previous intersection count");

  };

  // let tempCamera1json = "";
  const fetchVideoStream2 = async (camUrl, controller) => {
    console.log(" in fetchVideoStream2");
    console.log(camUrl);

    try {
      // const oldDataResponse = await fetch(`${baseUrl8000}/stream/get_constant?camera_name=camera_1`)
      // const oldData = await oldDataResponse.json();


      let jsonData = ""
      const response = await fetch(camUrl, { signal: controller.signal });
      const reader = response.body.getReader();
      let imageData = "";


      while (true) {
        const { done, value } = await reader.read();
        // console.log(value);
        if (done) break;
        const parts = new TextDecoder("utf-8").decode(value).split("\r\n\r\n");
        // console.log(parts);

        if (parts.length == 2) {
          imageData += parts[1];
        } else if (parts.length == 1) {
          imageData += parts[0];

        } else if (parts.length == 4) {
          try {
            let temp = JSON.parse(parts[2]);
            if (temp.side_1 == undefined) {

            } else {
              // temp = {
              //   ...temp,
              //   side_1_F: oldData.side_1_F + temp.side_1_F,
              //   side_1_M: oldData.side_1_M + temp.side_1_M,
              //   side_2_F: oldData.side_2_F + temp.side_2_F,
              //   side_2_M: oldData.side_2_M + temp.side_2_M,
              // }
              jsonData = temp
            }
            // jsonPromise = new Promise(resolve => resolve({ ...jsonData }));

            imageData += parts[0];
            if (!parts[0].startsWith("--frame")) {
              let base64Img = "data:image/png;base64, " + imageData;
              // imagePromise = new Promise(resolve => resolve(base64Img));

              setCamera2StreamInfo({
                stream: base64Img,
                data: jsonData

              })
            }
            imageData = "";

          } catch (error) {
            console.log("Error parsing JSON data");
          }


        } if (parts.length == 5) {
          try {
            // let jsonData = JSON.parse(parts[3]);
            let temp = JSON.parse(parts[3]);
            if (temp.side_1 == undefined) {
            } else {
              temp = {
                ...temp,
                side_1_F: oldData.side_1_F + temp.side_1_F,
                side_1_M: oldData.side_1_M + temp.side_1_M,
                side_2_F: oldData.side_2_F + temp.side_2_F,
                side_2_M: oldData.side_2_M + temp.side_2_M,
              }
              jsonData = temp
            }
            // jsonPromise = new Promise(resolve => resolve({ ...jsonData }));


            imageData += parts[1];
            if (!parts[1].startsWith("--frame")) {
              let base64Img = "data:image/png;base64, " + imageData;
              // imagePromise = new Promise(resolve => resolve(base64Img));




              setCamera2StreamInfo({
                stream: base64Img,
                data: jsonData

              })
            }
            imageData = "";


          } catch (error) {
            console.log("Error parsing JSON data");
          }


        }

        // if (jsonPromise && imagePromise) {
        //   const [json, image] = await Promise.all([jsonPromise, imagePromise]);

        //   if (json.side_1_M) {

        //     // setStreamInfo(json);

        //     setStreamInfo({ ...streamInfo, camera2: json })


        //     setFrames({ ...frames, camera2: image })

        //     setCamera2StreamInfo({
        //       stream: image,
        //       data: json

        //     })

        //     // setFrame(image);
        //     jsonPromise = null;
        //     imagePromise = null;

        //     // console.log(json);

        //   }
        // }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.error("Error:", error.message);
      }
    }
  };



  const options = {
    filename: "advanced-example.pdf",
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    // resolution: Resolution.EXTREME,
    resolution: Resolution.MEDIUM,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: "A4",
      // default is 'portrait'
      // orientation: "landscape"
      orientation: "portrait"
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/jpeg",
      qualityRatio: 1
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true
      }
    }
  };

  const getTargetElement = () => document.getElementsByClassName("container11")[0];
  console.log(getTargetElement);

  const downloadPdf = () => {

    generatePDF(getTargetElement, options)
  };

  return (
    <div className="PAMainBox"
      style={{
        height: `calc(100vh - ${heightOffset}px)`,
        paddingTop: (heightOffset != 10 && "10px"),
        position: "relative",
        // border:"2px solid purple"
      }}
    >
      {/* <ChartsModal
        historyData={historyData}
        occupancyPieChartData={occupancyPieChartData}
        heatMapDirectionToggle={heatMapDirectionToggle}
        toggleHeatMap={toggleHeatMap}
        baseUrl8000={baseurlCharts}
        cameraIndex={cameraIndex}
        chartUpdateFlag={chartUpdateFlag}
        historyDate={historyDate}
      /> */}

      {/* Toggle the charts layer start */}
      {(chartsToggleState.show == false) &&
        <Box
          className="showChartsIconBox"
          title="Show Charts"
          onClick={() => handleScrollToBottom("moveDown")}
        >
          <ArrowDownwardIcon sx={{ fontSize: chartsToggleState.iconSize }} />
        </Box>
      }
      {/* Toggle the charts layer end */}


      {/* Open Settings View */}
      <Box className="settingsIconBox" sx={{ right: (chartsToggleState.settingPanelStatus) && "410px" }}>
        <SettingsIcon className="settingIcon" sx={{ fontSize: chartsToggleState.iconSize }} onClick={handleSettingPanel} />
      </Box>
      <SettingsPanel chartsToggleState={chartsToggleState} setChartsToggleState={setChartsToggleState} />
      {/* Open Settings View */}



      {/* <button onClick={downloadPdf}>exportAllCharts</button> */}



      <div ref={TopLayerDiv} className="PAMainRightBox">
        {/* MAIN DASHBOARD AREA */}
        <div className="PARDashboardBox" style={{ gap: heightOffset == "10" ? "10px" : "5px" }} >

          <div className="PARightBoxChartsLeft" style={{ height: `50%` }} >
            {/* ------ IMAGE AND MAP AREA ------ */}
            <div className="PARightBoxChartsLeftCameraAndMap">

              <div className="PASideBarTopBox1" style={{ borderRadius: "10px" }}>
                {sideBarItems.map((item, index) => (
                  <div
                    key={item + "_" + index}
                    className={`PASideBarItem ${item["active"] && "active"}`}
                    onClick={() => handleSelectSideBarItem(index)}
                  >
                    <div className="PASideBarItemIconBox">
                      <VideoCameraBackIcon style={{ fontSize: "50px", color: item["active"] ? "#FF00FF" : "#2A6EBB" }}
                      />
                    </div>

                    <div className="PASideBarItemTitle">
                      Camera {item["index"]}
                    </div>
                  </div>
                ))}
              </div>

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
              <div className="mapParentBox">
                {/* <GoogelMapComponent /> */}
                {/* <div> */}
                {/* <img
                  src={leapHeader}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                  alt="Leap Header"
                /> */}
                {/* </div> */}
                <Map
                  markersPosition={markersPosition}
                  setMarkersPosition={setMarkersPosition}
                  handleSelectSideBarItem={handleSelectSideBarItem}
                />
              </div>

              {/* Date Time and Date Selecter divs */}
              <div className="PARightBoxChartsRight" style={{ padding: '0px' }}>
                <div className="PAMostRigtTopBox" style={{ height: "100%" }}>

                  <div className="PAInfoCard" style={{ color: "#000" }}>
                    <div style={{
                      textAlign: "center", fontWeight: "bold", fontSize: "1.8vw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                    }}>
                      {monthNames[time.getMonth()]} <br />{" "}
                      <span className="date"></span>
                      {time.getDate()}
                    </div>
                  </div>
                  <div className="PAInfoCard" style={{ color: "#000" }}>
                    <div style={{
                      textAlign: "center", fontWeight: "bold", fontSize: "1.8vw", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                    }}>
                      Time <br /> <span className="date"></span>
                      {time.toLocaleTimeString()}
                    </div>
                  </div>
                  {/* ********************** */}

                  <div >
                    <DateSelector
                      label="Select Date"
                      dateType="selectedDate"
                      historyDate={historyDate}
                      setHistoryDate={setHistoryDate}
                      // showAreaChartData={showAreaChartData}
                      enabledDates={enabledDates}
                      setEnabledDates={setEnabledDates}
                      setDefaultFilePath={setDefaultFilePath}
                      setSelectedDate={setSelectedDate}
                      cameraIndex={cameraIndex}
                      groupChartData={groupChartData}
                      setGroupChartData={setGroupChartData}
                      baseUrl8001={baseurlCharts}
                    />

                  </div>
                </div>

                {/* --------- Donot Chart AREA ---------- */}

                {/* --------- Donot Chart AREA ---------- */}
              </div>
            </div>
            {/* ------ IMAGE AND MAP AREA ------ */}

          </div>
          {/* </div> */}

          {/* Gender Cards Area */}
          <div className="PACenterBottomArea">
            <div className="PACenterBottomAreadiv1">
              <div className="PAGenderCardBox">
                <GenderCard
                  // heading="Upward"
                  // heading="Side 1"
                  heading={constants.side1Text}
                  imgSrcFemale={femalIcon}
                  imgSrcMale={maleIcon}
                  // femaleCount={upwardFemaleCount}
                  // maleCount={upwardMaleCount}
                  // femaleCount={streamInfo[selectedCamera].side_1_F}
                  // maleCount={streamInfo[selectedCamera].side_1_M}
                  femaleCount={
                    (selectedCamera === "camera1" && camera1StreamInfo.data) ?
                      camera1StreamInfo.data.side_1_F :
                      ((selectedCamera === "camera2" && camera2StreamInfo.data) ?
                        camera2StreamInfo.data.side_1_F :
                        0
                      )
                  }
                  maleCount={
                    (selectedCamera === "camera1" && camera1StreamInfo.data) ?
                      camera1StreamInfo.data.side_1_M :
                      ((selectedCamera === "camera2" && camera2StreamInfo.data) ?
                        camera2StreamInfo.data.side_1_M :
                        0
                      )
                  }

                />
              </div>
              <div className="PAGenderCardBox">
                <GenderCard
                  // heading="Side 2"
                  heading={constants.side2Text}
                  imgSrcFemale={femalIcon}
                  imgSrcMale={maleIcon}
                  // femaleCount={downwardFemaleCount}
                  // maleCount={downwardMaleCount}
                  // femaleCount={streamInfo[selectedCamera].side_2_F}
                  // maleCount={streamInfo[selectedCamera].side_2_M}
                  femaleCount={
                    (selectedCamera === "camera1" && camera1StreamInfo.data) ?
                      camera1StreamInfo.data.side_2_F :
                      ((selectedCamera === "camera2" && camera2StreamInfo.data) ?
                        camera2StreamInfo.data.side_2_F :
                        0
                      )
                  }
                  maleCount={
                    (selectedCamera === "camera1" && camera1StreamInfo.data) ?
                      camera1StreamInfo.data.side_2_M :
                      ((selectedCamera === "camera2" && camera2StreamInfo.data) ?
                        camera2StreamInfo.data.side_2_M :
                        0
                      )
                  }
                />
              </div>
              <div className="PAGenderCardBox">
                <GenderCard
                  heading="Total"
                  conditionText={"total"}
                  imgSrc={multipleUserIcon}
                  // femaleCount={upwardFemaleCount + downwardFemaleCount}
                  // maleCount={upwardMaleCount + downwardMaleCount}
                  // femaleCount={streamInfo[selectedCamera].side_1_F + streamInfo[selectedCamera].side_2_F}
                  // maleCount={streamInfo[selectedCamera].side_1_M + streamInfo[selectedCamera].side_2_M}
                  femaleCount={
                    (selectedCamera === "camera1" && camera1StreamInfo.data) ?
                      camera1StreamInfo.data.side_1_F + camera1StreamInfo.data.side_2_F :
                      ((selectedCamera === "camera2" && camera2StreamInfo.data) ?
                        camera2StreamInfo.data.side_1_F + camera2StreamInfo.data.side_2_F :
                        0
                      )
                  }
                  maleCount={
                    (selectedCamera === "camera1" && camera1StreamInfo.data) ?
                      camera1StreamInfo.data.side_1_M + camera1StreamInfo.data.side_2_M :
                      ((selectedCamera === "camera2" && camera2StreamInfo.data) ?
                        camera2StreamInfo.data.side_1_M + camera2StreamInfo.data.side_2_M :
                        0
                      )
                  }



                />
              </div>
            </div>
            <div className="PACenterBottomAreadiv2">
              <div className="PAGenderCardBox">
                <GenderCard
                  // heading="Side 1"
                  heading={constants.side1Text}
                  imgSrcFemale={femalIcon}
                  imgSrcMale={maleIcon}
                  femaleCount={historyData.approx_count_side_1_F.reduce((total, current) => total + current, 0)}
                  maleCount={historyData.approx_count_side_1_M.reduce((total, current) => total + current, 0)}
                />
              </div>
              <div className="PAGenderCardBox">
                <GenderCard
                  heading={constants.side2Text}
                  imgSrcFemale={femalIcon}
                  imgSrcMale={maleIcon}
                  femaleCount={historyData.approx_count_side_2_F.reduce((total, current) => total + current, 0)}
                  maleCount={historyData.approx_count_side_2_M.reduce((total, current) => total + current, 0)}
                />
              </div>
              <div className="PAGenderCardBox">
                <GenderCard
                  heading="Total"
                  imgSrc={multipleUserIcon}
                  femaleCount={historyData.approx_female_total_count}
                  maleCount={historyData.approx_male_total_count}
                  conditionText={"total"}
                />
              </div>
            </div>
          </div>
          {/* Gender Cards Area */}

          <div className="PASideBarBottomBox container11"
            style={{
              // height: (heightOffset == 10 ? `calc(100vh - 15% - 50% - 40px - ${heightOffset}px)` : `calc(100vh - 15% - 50% - 50px - ${heightOffset}px)`),
              // width:"calc(100% - 10px)",

              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              flex: 1
            }}
          >
            <div style={{
              // height: (heightOffset == 10 ? `calc(100vh - 15% - 50% - 40px - ${heightOffset}px)` : `calc(100vh - 15% - 50% - 50px - ${heightOffset}px)`),
              // width:"calc(100% - 10px)",
              height: (chartsToggleState) ? "180px" : "250px",
              display: "flex",
              // flexDirection: "column",
              gap: 10,
              justifyContent: "center"
            }}>


              {/* donut charts */}
              <div

                style={{
                  margin: "0px",
                  width: "calc(50% - 10px)",
                  display: "flex",
                  boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                }}
              >

                <PlotlyDonut
                  upwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_1_M :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_1_M :
                        0
                  }
                  upwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_1_F :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_1_F :
                        0
                  }
                  downwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_2_M :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_2_M :
                        0
                  }
                  downwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_2_F :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_2_F :
                        0
                  }
                  donutType="upward" // or "downward" based on your requirement
                  // title="Side 1" // or "Side 2" based on your requirement
                  title={constants.side1Text} // or "Side 2" based on your requirement
                  headerHeight={heightOffset}
                  side1Text={constants.side1Text}
                  side2Text={constants.side2Text}
                  labelFontSize={constants.donutChartTitleFontSize}

                />

                <PlotlyDonut
                  upwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_1_M :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_1_M :
                        0
                  }
                  upwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_1_F :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_1_F :
                        0
                  }
                  downwardMaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_2_M :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_2_M :
                        0
                  }
                  downwardFemaleCount={
                    selectedCamera === "camera1" && camera1StreamInfo.data ?
                      camera1StreamInfo.data.side_2_F :
                      selectedCamera === "camera2" && camera2StreamInfo.data ?
                        camera2StreamInfo.data.side_2_F :
                        0
                  }
                  donutType="downward" // or "downward" based on your requirement
                  title={constants.side2Text} // or "Side 2" based on your requirement
                  headerHeight={heightOffset}
                  side1Text={constants.side1Text}
                  side2Text={constants.side2Text}
                  labelFontSize={constants.donutChartTitleFontSize}
                />


              </div>

              {/* donut charts */}

              {/* Group Bar Chart */}
              <div
                style={{
                  boxShadow: " 0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  width: "calc(50% - 10px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // borderRadius: "10px"
                }}
              >
                <div className="chart2" style={{ position: "relative" }}>
                  {/* <span style={{ position: "absolute", right: 10, top: 0, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                  {occupancyPieChartData.selectedDate}
                </span> */}
                  <div style={{ position: "absolute", left: 20, top: 0, zIndex: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={currentSide === 1}
                          onChange={toggleSide}
                          name="toggleSide"
                          size="small"
                          color="primary"
                        />
                      }
                      label={
                        currentSide === 1 ? (
                          <span style={{ fontSize: 13 }}>{constants.side1Text}</span>
                        ) : (
                          <span style={{ fontSize: 13 }}>{constants.side2Text}</span>
                        )
                      }
                    />
                  </div>

                  {currentSide == 1 ? (
                    <PlotlyGroupedBarChart
                      groupChartData={groupChartData}
                      setGroupChartData={setGroupChartData}
                      side={1}
                      historyData={historyData}
                      side1Text={constants.side1Text}
                      side2Text={constants.side2Text}
                    />
                  ) : (
                    <PlotlyGroupedBarChart
                      groupChartData={groupChartData}
                      setGroupChartData={setGroupChartData}
                      side={2}
                      historyData={historyData}
                      side1Text={constants.side1Text}
                      side2Text={constants.side2Text}
                    />
                  )}

                </div>
              </div>
              {/* Group Bar Chart */}




            </div>


            {(chartsToggleState.show) ?
              <div className="container11" style={{
                position: "relative",
                paddingBottom: "10px",
                marginTop: "10px"
                // height: "1240px",
                // border: "1px solid red"
              }}>


                <div style={{
                  display: "flex", gap: "10px", width: "calc(100% - 20px)", margin: "auto",
                  // height: "400px",
                  flexWrap: "wrap"
                }}>

                  {/* Occupancy chart */}
                  {(chartsToggleState.occupancyPieChart) &&
                    <div className="chartsMainBox">


                      <span style={{ position: "absolute", right: 10, top: 14, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                        {occupancyPieChartData.selectedDate}
                      </span>
                      <PlotlyOccupancyPieChart
                        occupancyPieChartData={occupancyPieChartData}
                        title={constants.pieChartOccupancyTitle}
                        font_size={constants.piechartTitleFontSize}
                      />

                    </div>
                  }
                  {/* Occupancy chart */}


                  {/* Heatmap Chart */}
                  {(chartsToggleState.heatmapChart) &&
                    <div className="chartsMainBox" style={{ overflowY: "auto", overflowX: "hidden" }}>

                      <span style={{ position: "absolute", right: 10, top: 5, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                        {/* {occupancyPieChartData.selectedDate} */}
                        {historyData?.selected_date}
                      </span>
                      <div style={{ position: "absolute", left: 20, top: 5, zIndex: 1 }}>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={heatMapDirectionToggle === 1}
                              onChange={toggleHeatMap}
                              name="toggleSide"
                              size="small"
                              color="primary"
                            />
                          }
                          label={
                            heatMapDirectionToggle === 1 ? (
                              <span style={{ fontSize: 13 }}>{constants.side1Text}</span>
                            ) : (
                              <span style={{ fontSize: 13 }}>{constants.side2Text}</span>
                            )
                          }
                        />
                      </div>

                      <PlotlyHeatmapChart
                        chartUpdateFlag={chartUpdateFlag}
                        historyDate={historyDate}
                        heatMapDirectionToggle={heatMapDirectionToggle}
                        title={constants.heatMapChartTitle}
                        titleFontSize={constants.heatMapChartTitleFontSize}
                        side1Text={constants.side1Text}
                        side2Text={constants.side2Text}
                        historyData={historyData}
                      />
                    </div>
                  }
                  {/* Heatmap Chart */}


                  {chartsToggleState.entryCountFemalesPieChart &&
                    <div className="chartsMainBox">
                      <span className="chartsDateDiv">
                        {/* {occupancyPieChartData.selectedDate} */}
                        {historyData?.selected_date}
                      </span>

                      <PlotlyPieChart
                        historyData={historyData}
                        title={constants.side1Text + " " + constants.pieChartTitle + " Females"}
                        side_and_Gender="approx_count_side_1_F"
                        font_size={constants.piechartTitleFontSize}
                      />
                    </div>
                  }

                  {chartsToggleState.entryCountMalesPieChart &&
                    <div className="chartsMainBox">
                      <span className="chartsDateDiv">
                        {/* {occupancyPieChartData.selectedDate} */}
                        {historyData?.selected_date}
                      </span>
                      <PlotlyPieChart
                        historyData={historyData}
                        title={constants.side1Text + " " + constants.pieChartTitle + " Males"}
                        side_and_Gender="approx_count_side_1_M"
                        font_size={constants.piechartTitleFontSize}
                      />
                    </div>
                  }


                  {chartsToggleState.exitCountFemalesPieChart &&
                    <div className="chartsMainBox">
                      <span className="chartsDateDiv">
                        {/* {occupancyPieChartData.selectedDate} */}
                        {historyData?.selected_date}
                      </span>
                      <PlotlyPieChart
                        historyData={historyData}
                        title={constants.side2Text + " " + constants.pieChartTitle + " Females"}
                        side_and_Gender="approx_count_side_2_F"
                        font_size={constants.piechartTitleFontSize}
                      />
                    </div>
                  }

                  {chartsToggleState.exitCountMalesPieChart &&
                    <div ref={lastChartDivRef} className="chartsMainBox">
                      <span className="chartsDateDiv">
                        {/* {occupancyPieChartData.selectedDate} */}
                        {historyData?.selected_date}
                      </span>
                      <PlotlyPieChart
                        historyData={historyData}
                        title={constants.side2Text + " " + constants.pieChartTitle + " Males"}
                        side_and_Gender="approx_count_side_2_M"
                        font_size={constants.piechartTitleFontSize}
                      />
                    </div>
                  }
                </div>

                {(chartsToggleState.show) &&
                  <Box
                    className="hideChartsIconBox"
                    title="Show Charts"
                    onClick={() => handleScrollToBottom("moveUp")}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: chartsToggleState.iconSize }} />
                  </Box>
                }

                {/* Bottom Four Pie charts */}
              </div> : null
            }




          </div>

          {/*------------ Bar chart and area chart area ---------------------*/}
        </div>

      </div>





    </div >
  );
}

export default PeopleAnalytics;
