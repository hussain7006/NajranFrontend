import React, { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
// import { useSelector } from 'react-redux';

function BarChart(props) {
  // const headerHeight = useSelector(data => data.headerHeight);
  // const [dataPoints, setDataPoints] = useState([]);
  const [dataPointsPerFrame, setDataPointsPerFrame] = useState([]);

  // const data = [
  //   {
  //     "occupancy_count": 0,
  //     "fps": 0.31,
  //     "date": "13-02-2024",
  //     "time": "14:50:07"
  //   },
  //   {
  //     "side_1": 0,
  //     "side_2": 0,
  //     "side_1_M": 0,
  //     "side_1_F": 0,
  //     "side_2_M": 0,
  //     "side_2_F": 0,
  //     "occupancy_count": 8,
  //     "fps": 0.14,
  //     "date": "13-02-2024",
  //     "time": "14:50:14"
  //   },
  //   {
  //     "side_1": 0,
  //     "side_2": 0,
  //     "side_1_M": 0,
  //     "side_1_F": 0,
  //     "side_2_M": 0,
  //     "side_2_F": 0,
  //     "occupancy_count": 10,
  //     "fps": 0.13,
  //     "date": "13-02-2024",
  //     "time": "14:50:22"
  //   },
  //   {
  //     "side_1": 0,
  //     "side_2": 0,
  //     "side_1_M": 0,
  //     "side_1_F": 0,
  //     "side_2_M": 0,
  //     "side_2_F": 0,
  //     "occupancy_count": 11,
  //     "fps": 0.16,
  //     "date": "13-02-2024",
  //     "time": "14:50:28"
  //   },
  //   {
  //     "side_1": 0,
  //     "side_2": 0,
  //     "side_1_M": 0,
  //     "side_1_F": 0,
  //     "side_2_M": 0,
  //     "side_2_F": 0,
  //     "occupancy_count": 8,
  //     "fps": 0.19,
  //     "date": "13-02-2024",
  //     "time": "14:50:34"
  //   }, {
  //     "side_1": 1,
  //     "side_2": 0,
  //     "side_1_M": 0,
  //     "side_1_F": 1,
  //     "side_2_M": 0,
  //     "side_2_F": 0,
  //     "occupancy_count": 7,
  //     "fps": 0.2,
  //     "date": "13-02-2024",
  //     "time": "14:50:39"
  //   }
  // ];
  const chartRef = useRef(null);
  const maxDataPoints = 50; // Maximum number of data points to display


  useEffect(() => {
    if (props.streamInfo.date) {
      const { date, time, occupancy_count } = props.streamInfo;
      const [day, month, year] = date.split('-');
      const [hours, minutes, seconds] = time.split(':');
      const dateTime = new Date(year, month - 1, day, hours, minutes, seconds);

      // Check if new date is at least 1 second greater than the last date in dataPointsPerFrame
      const lastDate = dataPointsPerFrame.length > 0 ? dataPointsPerFrame[dataPointsPerFrame.length - 1].x : null;
      const timeDifference = lastDate ? (dateTime - lastDate) / 1000 : Infinity;

      if (timeDifference >= 1) {
        // Update dataPointsPerFrame state
        setDataPointsPerFrame(prevData => {
          const newData = [...prevData, { x: dateTime, y: occupancy_count }];
          // Trim data if it exceeds maxDataPoints
          if (newData.length > maxDataPoints) {
            newData.shift(); // Remove the oldest data point
          }
          return newData;
        });
      }
    }
  }, [props.streamInfo, dataPointsPerFrame]);


  useEffect(() => {
    setDataPointsPerFrame([])
  }, [props.sideBarItems])

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: function (value) {
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
            return new Date(value).toLocaleTimeString('en-US', options);
          }
        },
        // tickAmount: 10, // Adjust the number of ticks as needed
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: '#ff00ff', // Pink (filled color) #ff00ff '#92278f'
              opacity: 1,
            },
            {
              offset: 100,
              color: 'white', // Pink (filled color) white
              opacity: 0.7,
            },
          ],
        },
      },
      stroke: {
        curve: 'smooth',
        colors: ['#ff00ff'], // Magenta (outline color) #ff00ff
        width: 2, // Outline width - 4
      },
      dropShadow: {
        enabled: true,
        top: 5, // Set the top shadow distance
        left: 0, // Set the left shadow distance
        blur: 1, // Set the blur effect
        opacity: 0.1, // Set the shadow opacity
      },
      responsive: [
        {
          breakpoint: 600, // controls the chart at screens <= 600px
          options: {
            chart: {
              width: '100%',
              height: '100%'
            },
          },
        },
      ],
    },
    series: [
      {
        name: 'Occupancy',
        data: dataPointsPerFrame, // [{x:date, y: 23}]
      },
    ],
  };

  return (
    <Chart
      ref={chartRef}
      options={chartData.options}
      series={chartData.series}
      type="area"
      width="100%"
      height="100%"
      // height={(headerHeight == 10) ? 220 : 150}
      style={{ minHeight: "0px !important" }}
      className="PAAreaChart"
    />
  );
}

export default BarChart;