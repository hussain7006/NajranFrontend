import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useEffect } from 'react';
function OccupancyBarChart() {
    const [cameraIndex, setCameraIndex] = useState(1);
    const [chartState, setChartState] = useState({

        series: [{
            data: [100, 230, 411, 360, 400, 580, 440, 1005, 1200, 400, 344, 200]
        }],
        options: {
            chart: {
                type: 'bar',
                // height: 380,
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: false,
                    columnWidth: '50%',
                    borderRadius: 0,

                    dataLabels: {
                        position: 'bottom'
                    },
                }
            },
            colors: ['#808285', '#952D98', '#1E1656', '#44C8F5', '#2A6EBB', '#722EA5'],
            dataLabels: {
                enabled: true,
                // textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                // formatter: function (val, opt) {
                //     return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                // },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            legend: {
                show: false,
                showForSingleSeries: true,
                showForNullSeries: true,
                showForZeroSeries: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                fontSize: "14px",
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
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            xaxis: {
                categories: ['9', '10', '11', '12', '13', '14', '15', '15', '16', '17', '18', '19'],
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            title: {
                text: 'Occupancy',
                align: 'center',
                floating: true,
                offsetY: 5,

            },
            subtitle: {
                text: '',
                align: 'center',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            }
        },
    });

    useEffect(() => {
        const fetchData = () => {
            axios.get(`http://192.168.100.114:8000/stream/get_occ_data_of_current_date?camera_name=camera_${cameraIndex}`)
                .then(response => {
                    const responseData = response.data;
                    const { success, data } = response.data
                    if (success && Array.isArray(data)) {
                        const data = responseData.data;
                        const occupancyCounts = data.map(item => item.occupancy_count);
                        const dates = data.map(item => {
                            const parts = item.date_.split('-');
                            return parts[parts.length - 1]; // Get the last part of the date
                        });
                        setChartState(prevState => ({
                            ...prevState,
                            series: [{
                                ...prevState.series[0],
                                data: occupancyCounts
                            }],
                            options: {
                                ...prevState.options,
                                xaxis: {
                                    ...prevState.options.xaxis,
                                    categories: dates
                                }
                            }
                        }));
                    } else {
                        console.error('Data is not in expected format:', responseData);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        fetchData();
    }, [cameraIndex]);



    return (
        <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="bar"
            height={"100%"}
            width={"100%"}
        />
    )
}

export default OccupancyBarChart