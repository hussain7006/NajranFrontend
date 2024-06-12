import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { constants } from '../../constants/constantsV3';
function AreaChart({ title, type, chartData, cameraIndex }) {
    // console.log("chart:");
    // console.log("cameraIndex:", cameraIndex);
    const getFillColor = (type) => {
        switch (type) {
            case 'male':
                return ['#0000FF', '#FFFFFF']; // Blue gradient for male
            case 'female':
                return ['#FF69B4', '#FFFFFF']; // Pink gradient for female
            default:
                return ['#FF00FF', '#FFFFFF']; // Default magenta gradient
        }
    };
    const data = [10, 2, 50, 89, 2,]
    const [state, setState] = useState({
        areaChartData: {
            options: {
                title: {
                    text: title,
                    align: 'center',
                    margin: 10,
                    offsetX: 0,
                    offsetY: 0,
                    floating: false,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: (type == "female") ? '#FF00FF' : "#2A6EBB",
                    },
                },
                chart: {
                    id: 'basic-bar',
                    label: "hussain",
                    toolbar: {
                        show: false,
                        autoSelected: "pan",
                    },
                    zoom: {
                        type: "x",
                        enabled: true,
                        autoScaleYaxis: false,
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        // console.log("val:", val);
                        // console.log("opts:", opts);
                        return val
                    },
                    // style: {
                    //     fontSize: '14px',
                    //     fontFamily: 'Helvetica, Arial, sans-serif',
                    //     colors: [function (opts) {
                    //         let value = opts.series[0][opts.dataPointIndex]
                    //         if (value == 1) {
                    //             return "green"
                    //         }
                    //         else if (value == 2) {
                    //             return "red"
                    //         }
                    //         else if (value == 3) {
                    //             return "#F9C846"
                    //         }
                    //         else if (value == 4) {
                    //             return "#C200FB"
                    //         }
                    //         else if (value == 5) {
                    //             return "#01BAEF"
                    //         }
                    //     }
                    //     ]
                    // },
                },
                grid: {
                    show: false,
                    borderColor: 'rgba(0,0,0,0.1)',
                },
                xaxis: {
                    categories: [],
                    crosshairs: {
                        show: false,
                        width: 10,
                        position: 'back',
                        opacity: 0.9,
                        stroke: {
                            color: '#B6B6B6',
                            width: 0,
                            dashArray: 0,
                        },
                        fill: {
                            type: 'solid',
                            color: '#B1B9C4',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            },
                        },
                        dropShadow: {
                            enabled: false,
                            top: 0,
                            left: 0,
                            blur: 1,
                            opacity: 0.4,
                        },
                    },
                    labels: {
                        formatter: function (value) {
                            // const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                            // return new Date(value).toLocaleTimeString('en-US', options);
                            if (value != undefined)
                                return value + " hr"
                        }
                    },
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return Math.round(value); // Display values without decimal points
                        }
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        enabled: true,
                        opacityFrom: 0.55,
                        opacityTo: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: (type == "female") ? '#FF00FF' : "#2A6EBB", // Pink (filled color)
                                opacity: 0.5,
                            },
                            {
                                offset: 100,
                                color: 'white', // Pink (filled color)
                                opacity: 0.5,
                            },
                        ],
                    }
                },
                // markers: {
                //     size: 3,
                //     // colors: ["#000524"],
                //     // strokeColor: "#00BAEC",
                //     // strokeWidth: 3
                // },
                stroke: {
                    curve: 'smooth',
                    colors: (type == "female") ? ['#FF00FF'] : ["#2A6EBB"], // Magenta (outline color)
                    width: 3, // Outline width
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
                                height: "100%"
                            },
                        },
                    },
                ],
                noData: {
                    text: (!constants.streaming || cameraIndex != 0) ? "Stream is offline" : "Data will appear shortly. Please wait...",
                    offsetX: 0,
                    offsetY: -20,
                    style: {
                        color: "#952D98",
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                },
            },
            series: [
                {
                    name: title,
                    data: (cameraIndex == 0) ? (type === 'male') ? chartData.males : chartData.females : [],
                },
            ],
        },
    });
    useEffect(() => {
        setState(prevState => ({
            areaChartData: {
                ...prevState.areaChartData,
                series: [
                    {
                        ...prevState.areaChartData.series[0],
                        data: (cameraIndex == 0) ? type === 'male' ? chartData.males : chartData.females : [],
                        // data: data?.length > 0 ? data : [],
                    },
                ],
                options: {
                    ...prevState.options,
                    xaxis: {
                        ...prevState.areaChartData.options.xaxis,
                        categories: (cameraIndex == 0) ? (chartData.hours || []) : [],
                    },
                    noData: {
                        text: (!constants.streaming || cameraIndex != 0) ? "Stream is offline" : "Data will appear shortly. Please wait...",
                        offsetX: 0,
                        offsetY: -20,
                        style: {
                            color: "#952D98",
                            fontSize: '14px',
                            fontFamily: undefined
                        }
                    },
                },
            },
        }));
    }, [chartData, cameraIndex]);
    return (
        <div style={{ width: "100%", height: "88%" }}>
            <Chart
                options={state.areaChartData.options}
                series={state.areaChartData.series}
                type="area"
                width="100%"
                height="100%"
            // className="PAAreaChart"
            />
        </div>
    );
}
export default AreaChart;