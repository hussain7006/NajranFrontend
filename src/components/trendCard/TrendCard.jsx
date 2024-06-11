import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import { constants } from "../../constants/constantsV3";

import Trend from 'react-trend';

const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    display:flex;
    justify-content: center;
    align-items: center;
    &:last-child {
    padding-bottom: 0;
    }
`);

export default function TrendCard(props) {
    let { trendCardData, cameraIndex } = props;
    // console.log("trendCardData:", trendCardData);


    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                width: "100%",
                margin: "0px",
                borderRadius: "15px"
            }}
        >
            <div style={{
                width: '100%',
                height: "100%",
                display: "flex",
                padding: 10,
                position: "relative"
            }}>
                <div style={{ width: "50%", paddingLeft: "0px" }}>

                    <div style={{ fontSize: 15, fontWeight: "bold", fontFamily: "Roboto", color: "#952D98" }}>{constants.trendCardTitle1}</div>
                    <div style={{ fontSize: 12 }}>{constants.trendCardTitle2}</div>
                    <div style={{ fontSize: "2vw", fontFamily: "Roboto", fontWeight: 500, textAlign: "center" }}>
                        {
                            (cameraIndex == 0) ?
                                trendCardData.lastHourCount
                                :
                                0
                        }
                    </div>
                </div>
                <div style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Trend
                        smooth
                        autoDraw
                        autoDrawDuration={1000}
                        autoDrawEasing="ease-out"
                        data={
                            (cameraIndex == 0) ?
                                (trendCardData.counts.length) > 0
                                    ?
                                    (trendCardData.counts.length == 1)
                                        ?
                                        ([1, 1])
                                        :
                                        (trendCardData.counts)
                                    :
                                    ([1, 1])
                                : [1, 1]
                            // ([0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 11])
                        }
                        gradient={
                            (trendCardData.slope >= 0)
                                ?
                                ['purple', 'violet']
                                :
                                ['red', 'orange']
                        }
                        radius={10}
                        strokeWidth={9.5}
                        strokeLinecap={'round'}
                    />
                </div>

            </div>
        </Card >
    );
}

