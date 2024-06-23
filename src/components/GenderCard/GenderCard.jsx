
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { constants } from "../../constants/constantsV3";
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    display:flex;
    justify-content: center;
    align-items: center;
    &:last-child {
    padding-bottom: 0;
    }
`);

function GenderCard(props) {
    let { heading, imgSrc, imgSrcRight, imgSrcLeft, rightText, leftText, conditionText, value, imgLeftWidth, imgRightWidth } = props;
    // console.log("conditionText:", conditionText);
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
                flexDirection: "column",
                justifyContent: "center",
            }}>
                <div>
                    {
                        conditionText == "total" ?
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <img src={imgSrc} style={{ width: imgLeftWidth, textAlign: "center", objectFit: "cover" }} />
                            </div>
                            :
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>

                                <div style={{ width: "50%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <img src={imgSrcLeft} style={{ width: imgLeftWidth, objectFit: "cover" }} />
                                </div>
                                <div style={{ width: "50%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <img src={imgSrcRight} style={{ width: imgRightWidth, objectFit: "cover" }} />
                                </div>
                            </div>

                    }
                </div>
                <div className="gender-text" style={{ width: "100%" }}>
                    <Typography
                        variant="body1"
                        fontSize={constants.cardsTitleFontSize}
                        fontWeight="bold"
                        sx={{ color: "#952D98", fontWeight: "bold", textAlign: "center" }}
                    >
                        {heading}
                    </Typography>
                    <div
                        style={{ width: "100%", fontSize: 18, margin: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        {
                            conditionText == "total" ?
                                <div>
                                    <p style={{ textAlign: "center", justifyContent: "center" }}>
                                        {
                                            value
                                        }

                                    </p>
                                </div>
                                :
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-around", gap: 4, width: "100%" }}>
                                        <span style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            {isNaN(leftText) ?
                                                0 :
                                                (leftText)
                                            }
                                        </span>
                                        <span style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            {isNaN(rightText) ?
                                                0 :
                                                (rightText)
                                            }
                                        </span>
                                    </div>
                                </>

                        }
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default GenderCard;