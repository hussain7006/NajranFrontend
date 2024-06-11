import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import CircularProgress from '@mui/material/CircularProgress';

// import { constants } from "../../constants/constants.js"

function PlotlyGroupedBarChart({
    id,
    groupChartData,
}) {

    // useEffect(() => {
    //     // console.log("in plotly group bar chart component");
    //     const { jsonData } = historyData;
    //     // console.log("jsonData:", jsonData);
    //     if (jsonData.length > 0) {

    //         let date_time = jsonData[0]["date_"].split('-');
    //         let display_date = date_time[0] + "-" + date_time[1] + "-" + date_time[2];

    //         // Use a Set to store unique time intervals
    //         const uniqueTimeIntervals = new Set();

    //         // Process JSON data to extract categories and series
    //         const approxCountMale = [];
    //         const approxCountFemale = [];
    //         jsonData.forEach(entry => {
    //             const hour = parseInt(entry.date_.split('-')[3]);
    //             if (hour >= constants.chartDataStartDate && hour <= constants.chartDataEndDate) {
    //                 uniqueTimeIntervals.add(hour);
    //                 approxCountMale.push(entry[`approx_count_side_${side}_M`]);
    //                 approxCountFemale.push(entry[`approx_count_side_${side}_F`]);
    //             }
    //         });
    //         // Convert Set back to an array for x-axis categories
    //         const categories = Array.from(uniqueTimeIntervals);

    //         setGroupChartData((prevState) => ({
    //             ...prevState,
    //             data: [
    //                 {
    //                     x: categories,
    //                     y: approxCountMale,
    //                     name: (side == 1) ? `${side1Text} Malesd` : `${side2Text} Male`,
    //                     type: 'bar',
    //                     // color: '#2a6ebb',
    //                     marker: { color: '#2a6ebb' }
    //                 }
    //                 // ,
    //                 // {
    //                 //     x: categories,
    //                 //     y: approxCountFemale,
    //                 //     name: (side == 1) ? `${side1Text} Femalecv` : `${side2Text} Femalecv`,
    //                 //     type: 'bar',
    //                 //     // color: '#ff00ff',
    //                 //     marker: { color: '#ff00ff' }
    //                 // }
    //             ],
    //             layout: {
    //                 ...prevState.layout,
    //                 barmode: 'group',
    //                 title: {
    //                     text: display_date,
    //                     x: 0.5,
    //                     y: 0.95,
    //                     xanchor: 'left',
    //                     yanchor: 'top',
    //                     font: {
    //                         size: 14,
    //                         color: '#263238',
    //                         family: undefined,
    //                         weight: 'bold',
    //                     },
    //                 },
    //                 margin: {
    //                     autoexpand: true,
    //                     l: 40,
    //                     t: 30,
    //                     b: 0,
    //                     r: 0,
    //                     pad: 0
    //                 },
    //                 autosize: true,
    //                 hovermode: 'x unified',
    //                 legend: {
    //                     // x: 0.4, // Adjust the x-coordinate to position the legend horizontally
    //                     // y: 0, // Adjust the y-coordinate to position the legend vertically
    //                     // xanchor: 'left',
    //                     // yanchor: 'top',
    //                     orientation: 'h',
    //                 },
    //                 // xaxis: {
    //                 //   title: {
    //                 //     text: 'X-Axis Title', // Set your desired x-axis title
    //                 //     font: {
    //                 //       size: 12,
    //                 //       color: '#263238',
    //                 //       // family: undefined,
    //                 //       weight: 'bold',
    //                 //     },
    //                 //   },
    //                 //   // tickvals: categories, // Set the tick values to your categories
    //                 //   ticktext: "categories", // Set the tick text to your categories
    //                 //   tickangle: -0, // Rotate the tick labels for better visibility
    //                 // },
    //                 // automargin: true   
    //                 xaxis: {
    //                     automargin: true,
    //                 },
    //                 yaxis: {
    //                     fixedrange: true, // Disable zooming along the y-axis
    //                 }
    //             },
    //         }));
    //     }
    // }, [side, historyData])

    let config = {
        showLink: false,
        displayModeBar: false,
        scrollZoom: true,
        responsive: true,
        dragmode: 'pan',

    };

    useEffect(() => {
    }, [groupChartData])

    return (
        <div id={id} style={{ height: "100%" }}>
            {
                groupChartData.data.length > 0 ?
                    <Plot
                        data={groupChartData.data}
                        layout={groupChartData.layout}
                        config={config}
                        style={{ width: "100%", height: "100%" }}
                    /> :
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

export default PlotlyGroupedBarChart;

