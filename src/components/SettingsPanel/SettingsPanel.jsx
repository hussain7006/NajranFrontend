import React, { useEffect } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function SettingsPanel({ chartsToggleState, setChartsToggleState }) {

    const handleCheckBox = (e, chartNameInState) => {
        console.log("e => ", e.target.checked);
        console.log("chartNameInState => ", chartNameInState);
        setChartsToggleState({ ...chartsToggleState, [chartNameInState]: !chartsToggleState[chartNameInState] })
    }

    useEffect(() => { }, [chartsToggleState])

    return (
        <div
            style={{
                position: "fixed",
                bottom: "5px",
                right: (chartsToggleState.settingPanelStatus) ? "5px" : "-400px",
                zIndex: 2,
                border: "1px solid",
                width: "400px",
                // height: "80vh",
                background: "#EEEDEB",
                transition: "all .3s ease"
            }}
        >
            <div
                style={{
                    background: "#952D98",
                    color: "#fff",
                    padding: "5px 5px",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                Configure Charts
            </div>
            <div style={{
                // border: "1px solid",
                padding: "10px 20px",
                display: "flex",
                flexDirection: "column"
            }}
            >
                {/* occupancy Checkbox */}
                <FormControlLabel value="" control={
                    <Checkbox checked={chartsToggleState.occupancyPieChart} onChange={(e) => handleCheckBox(e, "occupancyPieChart")} />
                }
                    label="Occupancy Pie Chart"
                    labelPlacement="end"
                />

                {/* heatmap Checkbox */}
                <FormControlLabel value="" control={
                    <Checkbox checked={chartsToggleState.heatmapChart} onChange={(e) => handleCheckBox(e, "heatmapChart")} />
                }
                    label="Heatmap"
                    labelPlacement="end"
                />

                {/* entryCountFemalesPieChart */}
                <FormControlLabel value="" control={
                    <Checkbox checked={chartsToggleState.entryCountFemalesPieChart} onChange={(e) => handleCheckBox(e, "entryCountFemalesPieChart")} />
                }
                    label="Entry Count Females Pie Chart"
                    labelPlacement="end"
                />

                {/*  */}
                <FormControlLabel value="" control={
                    <Checkbox checked={chartsToggleState.entryCountMalesPieChart} onChange={(e) => handleCheckBox(e, "entryCountMalesPieChart")} />
                }
                    label="Entry Count Males Pie Chart"
                    labelPlacement="end"
                />
                {/* exitCountFemalesPieChart */}
                <FormControlLabel value="" control={
                    <Checkbox checked={chartsToggleState.exitCountFemalesPieChart} onChange={(e) => handleCheckBox(e, "exitCountFemalesPieChart")} />
                }
                    label="Exit Count Females Pie Chart"
                    labelPlacement="end"
                />

                {/*  */}
                <FormControlLabel value="" control={
                    <Checkbox checked={chartsToggleState.exitCountMalesPieChart} onChange={(e) => handleCheckBox(e, "exitCountMalesPieChart")} />
                }
                    label="Exit Count Males Pie Chart"
                    labelPlacement="end"
                />
            </div>
        </div>
    )
}

export default SettingsPanel