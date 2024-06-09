import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import CircularProgress from '@mui/material/CircularProgress';
// import jsonData from '../../../public/peopleAnalyticsJson/camera_1_occupancy_data/2023-12-27_data';
//import jsonData from '../../../public/peopleAnalyticsJson/occupancy_2/2024-02-14_data(1)';

function GroupedBarChart({
  groupChartData,
  setGroupChartData,
  side,
  selectedDate,
  enabledDates,
  cameraIndex,
  historyData
}) {
  //console.log("Selected Date:", selectedDate)



  // useEffect(() => {
  //   // Process JSON data to extract categories and series
  //   const categories = jsonData.map(entry => entry.date_);
  //   // const maleSeries = jsonData.map(entry => entry[`side_${side}_M`]);
  //   // const femaleSeries = jsonData.map(entry => entry[`side_${side}_F`]);


  //   const approxCountMale = jsonData.map(entry => entry[`approx_count_side_${side}_M`]);
  //   const approxCountFemale = jsonData.map(entry => entry[`approx_count_side_${side}_F`]);

  //   // console.log("approxCountMale =>", approxCountMale);
  //   // console.log("approxCountFemale =>", approxCountFemale);

  //   setGroupChartData(prevState => ({
  //     ...prevState,
  //     series: [
  //       // { name: 'Male', data: maleSeries },
  //       // { name: 'Female', data: femaleSeries }
  //       { name: 'Male', data: approxCountMale },
  //       { name: 'Female', data: approxCountFemale }
  //     ],
  //     options: {
  //       ...prevState.options,
  //       xaxis: {
  //         ...prevState.options.xaxis,
  //         categories: categories
  //       }
  //     }
  //   }));
  // }, [side, selectedDate]);

  // useEffect(() => {
  //   console.log("selectedDate:", selectedDate);
  //   console.log("cameraIndex:", cameraIndex);
  //   const fetchData = async () => {
  //     try {
  //       let filePath;
  //       let url;
  //       if (selectedDate.length != 0) {
  //         // If a date is selected, use the selected date's file path
  //         filePath = `D:\\people_counting_analytics\\json_data\\camera_${cameraIndex}\\${selectedDate}_data.json`;
  //         url = `http://192.168.100.114:8001/stream/get_data?file_path=${encodeURIComponent(filePath)}`;
  //         // console.log("selected date", selectedDate);
  //       } else {
  //         // If no date is selected, use the latest available data
  //         url = `http://192.168.100.114:8000/stream/get_latest_file?camera_name=camera_${cameraIndex}`
  //       }

  //       const response = await fetch(url);
  //       const jsonData = await response.json();
  //       let display_date = jsonData[0]["date_"].split('-');
  //       display_date = display_date[0] + "-" + display_date[1] + "-" + display_date[2];
  //       console.log("display_date = ", display_date);

  //       // Process JSON data to extract categories and series
  //       const categories = jsonData.map(entry => entry.date_);
  //       const approxCountMale = jsonData.map(entry => entry[`approx_count_side_${side}_M`]);
  //       const approxCountFemale = jsonData.map(entry => entry[`approx_count_side_${side}_F`]);

  //       // console.log("approxMaleCount:", approxCountMale);
  //       // console.log("approxCountFemale:", approxCountFemale);
  //       // console.log("categories:", categories);

  //       setGroupChartData((prevState) => ({
  //         ...prevState,

  //         series: [
  //           { name: 'Male', data: approxCountMale },
  //           { name: 'Female', data: approxCountFemale }
  //         ],
  //         options: {
  //           ...prevState.options,
  //           xaxis: {
  //             ...prevState.options.xaxis,
  //             categories: categories
  //           },

  //           title: {
  //             // text: "2024-01-10",
  //             text: display_date,
  //             align: 'center',
  //             margin: 10,
  //             offsetX: 0,
  //             offsetY: 0,
  //             floating: false,
  //             style: {
  //               fontSize: '14px',
  //               fontWeight: 'bold',
  //               fontFamily: undefined,
  //               color: '#263238'
  //             },
  //           },
  //         }
  //       }));
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [side, selectedDate, enabledDates]);


  useEffect(() => {
    const { jsonData } = historyData;
    if (jsonData.length > 0) {

      let display_date = jsonData[0]["date_"].split('-');
      display_date = display_date[0] + "-" + display_date[1] + "-" + display_date[2];

      // Process JSON data to extract categories and series
      const categories = jsonData.map(entry => entry.date_);
      const approxCountMale = jsonData.map(entry => entry[`approx_count_side_${side}_M`]);
      const approxCountFemale = jsonData.map(entry => entry[`approx_count_side_${side}_F`]);

      setGroupChartData((prevState) => ({
        ...prevState,

        series: [
          { name: 'Male', data: approxCountMale },
          { name: 'Female', data: approxCountFemale }
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories
          },

          title: {
            // text: "2024-01-10",
            text: display_date,
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
        }
      }));
    }
  }, [side, historyData])

  return (
    <div style={{ height: "100%" }}>
      {
        groupChartData.series.length > 0 ?
          <ReactApexChart options={groupChartData.options} series={groupChartData.series} type="bar" width={"100%"} height={"100%"} /> :
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>

            <CircularProgress />
          </div>
      }
    </div>
  );
}

export default GroupedBarChart;



// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import jsonData from '../../../public/camera_1_occupancy_data/2023-12-27_data';

// function GroupedBarChart() {
//   const [groupChartData, setGroupChartData] = useState({
//     series: [],
//     options: {
//       chart: {
//         type: 'bar',
//         height: 350
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: '55%',
//           endingShape: 'rounded'
//         },
//       },
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ['transparent']
//       },
//       xaxis: {
//         categories: [],
//         labels: {
//           formatter: function (value) {
//             // Display the extracted time directly without formatting
//             return value;
//           }
//         }
//       },
//       yaxis: {
//         title: {
//           text: 'Count'
//         }
//       },
//       fill: {
//         opacity: 1
//       },
//       tooltip: {
//         y: {
//           formatter: function (val) {
//             return val;
//           }
//         }
//       }
//     }
//   });

//   useEffect(() => {
//     // Use a Set to store unique time intervals
//     const uniqueTimeIntervals = new Set();

//     // Process JSON data to extract categories and series
//     jsonData.forEach(entry => {
//       const hour = parseInt(entry.date_.split('-')[3]);
//       const formattedHour = `${hour}:00-${hour + 1}:00`;
//       uniqueTimeIntervals.add(formattedHour);
//     });

//     // Convert Set back to an array for x-axis categories
//     const categories = Array.from(uniqueTimeIntervals);

//     const maleSeries = jsonData.map(entry => entry.side_1_M);
//     const femaleSeries = jsonData.map(entry => entry.side_1_F);

//     setGroupChartData(prevState => ({
//       ...prevState,
//       series: [
//         { name: 'Male', data: maleSeries },
//         { name: 'Female', data: femaleSeries }
//       ],
//       options: {
//         ...prevState.options,
//         xaxis: {
//           ...prevState.options.xaxis,
//           categories: categories
//         }
//       }
//     }));
//   }, []); // Empty dependency array ensures the effect runs only once

//   return (
//     <div>
//       <div id="chart">
//         <ReactApexChart options={groupChartData.options} series={groupChartData.series} type="bar" height={350} />
//       </div>
//       <div id="html-dist"></div>
//     </div>
//   );
// }

// export default GroupedBarChart;