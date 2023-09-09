import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as d3 from "d3";

function CntrywithRel({ selectedCountry }) {
  const svgRef = useRef(null);
  const [countries, setCountries] = useState([]);


  useEffect(() => {
    // Fetch list of unique countries from the API

    axios
      .get("http://localhost:5000/api/data")
      .then((response) => {
        const data = response.data;
        const uniqueCountries = [...new Set(data.map((item) => item.country))];
        setCountries(uniqueCountries);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);


  useEffect(() => {
    // Fetch data from the API
    if (selectedCountry === '') {
      return; // Do not render if no country is selected
    }

    axios
      .get("http://localhost:5000/api/data",{
        params: { country: selectedCountry },
      })
      .then((response) => {
        const data = response.data;

        // Prepare data for the pie chart
        const topics = {};
        data.forEach((item) => {
          if (topics[item.topic]) {
            topics[item.topic]++;
          } else {
            topics[item.topic] = 1;
          }
        });
        const pieData = Object.entries(topics).map(([topic, count]) => ({
          topic,
          count,
        }));

        // Calculate total relevance for each country
        const countryRelevance = {};
        data.forEach((item) => {
          if (countryRelevance[item.country]) {
            countryRelevance[item.country] += item.relevance;
          } else {
            countryRelevance[item.country] = item.relevance;
          }
        });

        // Convert country relevance data into an array of objects
        const donutData = Object.entries(countryRelevance).map(
          ([country, relevance]) => ({
            country,
            relevance,
          })
        );

        // Set up D3.js
        const width = 800;
        const height = 400;
        const radius = Math.min(width, height) / 3; // Reduce the radius for the inner donut chart
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pie = d3
          .pie()
          .value((d) => d.relevance)
          .sort(null);

        const arc = d3
          .arc()
          .innerRadius(radius * 0.5) // Set inner radius for donut chart
          .outerRadius(radius);

        const arcs = svg
          .selectAll(".arc")
          .data(pie(donutData))
          .enter()
          .append("g")
          .attr("class", "arc");

        arcs
          .append("path")
          .attr("d", arc)
          .attr("fill", (d, i) => color(i))
          .style("transition", "transform 0.2s ease-out") // Add transition effect
          .on("mouseover", function (event, d) {
            // Bouncing effect on hover
            d3.select(this)
              .transition()
              .duration(200)
              .attr("transform", `scale(1.1)`);

            // Display TR and country values on hover with a changed font
            // Display TR and country values on hover with a changed font
            svg
              .append("text")
              .attr("class", "tooltip")
              .attr("x", 0)
              .attr("y", 0)
              .attr("text-anchor", "middle")
              .style("font-size", "18px") // Change font size
              .style("font-weight", "bold")
              .style("fill", "black")
              .text(`TR - ${d.data.relevance} Cntry - ${d.data.country}`)
              .attr("transform", `translate(${arc.centroid(d)})`);
          })
          .on("mouseout", function () {
            // Remove bouncing effect and tooltip on mouseout
            // Remove bouncing effect and tooltip on mouseout
            d3.select(this)
              .transition()
              .duration(200)
              .attr("transform", "scale(1)");

            d3.select(".tooltip").remove();
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedCountry]);

  return (
    <>
      <h2> By Relevance</h2>
      <div>
      <label htmlFor="topic"> <i><b>Select a Country:</b></i> </label>
        <select id="country" value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)}>
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default CntrywithRel;
