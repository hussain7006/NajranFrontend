import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const Heatmap = ({
    baseUrl8000
}) => {

    useEffect(() => {
        // console.log("historyDate.selectedDate:", historyDate.selectedDate);
        // console.log("cameraIndex:", cameraIndex);
        const getCurrentDataForHeatMap = async () => {
            try {
                const url = `${baseUrl8000}/stream/get_int_data_of_current_date?camera_name=${'camera_1'}`;

                const response = await fetch(url);
                const jsonData = await response.json();


                const { success, data } = jsonData;
                let tempHeatMapData = [];

                if (success) {
                    data.map((item, index) => {
                        let { date_, side_1_F, side_1_M } = item;

                        let hour = date_.toString().split("-")[3];
                        let tempJson = {
                            name: hour,
                            data: [{
                                x: 'side_1_F',
                                y: side_1_F
                            }, {
                                x: 'side_1_M',
                                y: side_1_M
                            }]
                        }

                        tempHeatMapData.push(tempJson)
                    })

                    setChartState((prevState) => ({
                        ...prevState,
                        series: tempHeatMapData
                    }))

                }



            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getCurrentDataForHeatMap();
    }, []);
    const [chartState, setChartState] = useState({
        series: [],
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                heatmap: {
                    colorScale: {
                        ranges: [{
                            from: 0,
                            to: 200000,
                            color: '#FFFFDF',
                            name: 'Very Low',
                        }, {
                            from: 200001,
                            to: 400000,
                            color: '#DBEEB7',
                            // color: '#00A100',
                            name: 'Low',
                        },
                        {
                            from: 400001,
                            to: 600000,
                            color: '#C0E0B9',
                            name: 'Medium',
                        },
                        {
                            from: 600001,
                            to: 800000,
                            color: '#65A7C1',
                            name: 'High',
                        },
                        {
                            from: 800001,
                            to: 1000000,
                            color: '#4776AE',
                            name: 'Very High',
                        },
                        {
                            from: 1000001,
                            to: 1200000,
                            color: '#344898',
                            name: 'Ultra High',
                        },
                        {
                            from: 1200001,
                            to: 1465593,
                            color: '#0c0a3b',
                            name: 'Extreme High',
                        }
                        ]
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ["#000"]
                },
                formatter: function (value) {
                    if (Math.abs(value) >= 1e6) {
                        return value.toExponential();
                    }
                    return value;
                }
            },
            title: {
                text: 'Hourly Counts of SIDE_1_F and SIDE_1_M Heatmap',
                align: 'center',
                floating: true,
                offsetY: 5,

            },
            legend: {
                show: true,
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                fontSize: "12px",
                fontFamily: "Helvetica, Arial",
                fontWeight: "bold",
                formatter: undefined,
                inverseOrder: true,
                width: undefined,
                height: undefined,
                tooltipHoverFormatter: undefined,
                customLegendItems: [],
                offsetX: -10,
                offsetY: 0,
                labels: {
                    colors: undefined,
                    useSeriesColors: false,
                },
                markers: {
                    width: 12,
                    height: 12,
                    strokeWidth: 0,
                    strokeColor: "#fff",
                    fillColors: undefined,
                    radius: 12,
                    customHTML: undefined,
                    onClick: undefined,
                    offsetX: 0,
                    offsetY: 0,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 0,
                },
                onItemClick: {
                    toggleDataSeries: false,
                },
                onItemHover: {
                    highlightDataSeries: false,
                },
            },
        }
    });

    // const [chartState, setChartState] = useState({
    //     series: [
    //         {
    //             name: "13",
    //             data: [{
    //                 x: 'side_1_F',
    //                 y: 729898
    //             }, {
    //                 x: 'side_1_M',
    //                 y: 1465593
    //             }]
    //         },
    //         {
    //             name: "12",
    //             data: [{
    //                 x: 'side_1_F',
    //                 y: 43972
    //             }, {
    //                 x: 'side_1_M',
    //                 y: 89765
    //             }]
    //         },
    //         {
    //             name: "11",
    //             data: [{
    //                 x: 'side_1_F',
    //                 y: 135
    //             }, {
    //                 x: 'side_1_M',
    //                 y: 265
    //             }]
    //         },
    //         {
    //             name: "10",
    //             data: [{
    //                 x: 'side_1_F',
    //                 y: 224335
    //             }, {
    //                 x: 'side_1_M',
    //                 y: 455624
    //             }]
    //         }
    //     ],
    //     options: {
    //         chart: {
    //             toolbar: {
    //                 show: false
    //             }
    //         },
    //         plotOptions: {
    //             heatmap: {
    //                 colorScale: {
    //                     ranges: [{
    //                         from: 0,
    //                         to: 200000,
    //                         color: '#FFFFDF',
    //                         name: 'Very Low',
    //                     }, {
    //                         from: 200001,
    //                         to: 400000,
    //                         color: '#DBEEB7',
    //                         // color: '#00A100',
    //                         name: 'Low',
    //                     },
    //                     {
    //                         from: 400001,
    //                         to: 600000,
    //                         color: '#C0E0B9',
    //                         name: 'Medium',
    //                     },
    //                     {
    //                         from: 600001,
    //                         to: 800000,
    //                         color: '#65A7C1',
    //                         name: 'High',
    //                     },
    //                     {
    //                         from: 800001,
    //                         to: 1000000,
    //                         color: '#4776AE',
    //                         name: 'Very High',
    //                     },
    //                     {
    //                         from: 1000001,
    //                         to: 1200000,
    //                         color: '#344898',
    //                         name: 'Ultra High',
    //                     },
    //                     {
    //                         from: 1200001,
    //                         to: 1465593,
    //                         color: '#0c0a3b',
    //                         name: 'Extreme High',
    //                     }
    //                     ]
    //                 }
    //             }
    //         },
    //         dataLabels: {
    //             enabled: true,
    //             style: {
    //                 colors: ["#000"]
    //             },
    //             formatter: function (value) {
    //                 if (Math.abs(value) >= 1e6) {
    //                     return value.toExponential();
    //                 }
    //                 return value;
    //             }
    //         },
    //         title: {
    //             text: 'Hourly Counts of SIDE_1_F and SIDE_1_M Heatmap',
    //             align: 'center',
    //             floating: true,
    //             offsetY: 5,

    //         },
    //         legend: {
    //             show: true,
    //             showForSingleSeries: true,
    //             showForNullSeries: true,
    //             showForZeroSeries: true,
    //             position: "bottom",
    //             horizontalAlign: "center",
    //             floating: false,
    //             fontSize: "12px",
    //             fontFamily: "Helvetica, Arial",
    //             fontWeight: "bold",
    //             formatter: undefined,
    //             inverseOrder: true,
    //             width: undefined,
    //             height: undefined,
    //             tooltipHoverFormatter: undefined,
    //             customLegendItems: [],
    //             offsetX: -10,
    //             offsetY: 0,
    //             labels: {
    //                 colors: undefined,
    //                 useSeriesColors: false,
    //             },
    //             markers: {
    //                 width: 12,
    //                 height: 12,
    //                 strokeWidth: 0,
    //                 strokeColor: "#fff",
    //                 fillColors: undefined,
    //                 radius: 12,
    //                 customHTML: undefined,
    //                 onClick: undefined,
    //                 offsetX: 0,
    //                 offsetY: 0,
    //             },
    //             itemMargin: {
    //                 horizontal: 10,
    //                 vertical: 0,
    //             },
    //             onItemClick: {
    //                 toggleDataSeries: false,
    //             },
    //             onItemHover: {
    //                 highlightDataSeries: false,
    //             },
    //         },
    //     }
    // });

    return (
        <ReactApexChart options={chartState.options} series={chartState.series} type="heatmap" />
    );
};

export default Heatmap;
