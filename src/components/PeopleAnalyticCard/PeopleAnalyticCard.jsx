import React from 'react'
import "./PeopleAnalyticCard.css"

function PeopleAnalyticCard({ title }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{
                textAlign: "center", fontSize: "30px",
                color: "#0070b8"
            }}>
                {title}
            </div>
        </div>
    )
}

export default PeopleAnalyticCard