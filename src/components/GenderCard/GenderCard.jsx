
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
    let { heading, imgSrc, imgSrcRight, imgSrcLeft, rightText, leftText, conditionText, value } = props;
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
                                <img src={imgSrc} style={{ width: "4.5vw", textAlign: "center", objectFit: "cover" }} />
                            </div>
                            :
                            <div style={{ display: "flex", justifyContent: "space-around" }}>

                                <img src={imgSrcLeft} style={{ width: "4.5vw", objectFit: "cover" }} />
                                <img src={imgSrcRight} style={{ width: "4.5vw", objectFit: "cover" }} />
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
                    <span
                        style={{ width: "100%", fontSize: 18, margin: 0 }}
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
                                    <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                                        <span>
                                            {isNaN(leftText) ?
                                                0 :
                                                (leftText)
                                            }
                                        </span>
                                        <span>
                                            {isNaN(rightText) ?
                                                0 :
                                                (rightText)
                                            }
                                        </span>
                                    </div>
                                </>

                        }
                    </span>
                </div>
            </div>
        </Card>
    );
}

export default GenderCard;