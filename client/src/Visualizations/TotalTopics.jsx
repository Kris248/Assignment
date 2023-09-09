import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function TotalTopics({ filterTopic, setCursorPosition }) {
  const svgRef = useRef(null);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:5000/api/data')
      .then(response => {
        const data = response.data;
        
        const filteredData = filterTopic
        ? data.filter(item => item.topic === filterTopic)
        : data;

      // Prepare data for the pie chart
      const topics = {};
      filteredData.forEach(item => {
        if (topics[item.topic]) {
          topics[item.topic]++;
        } else {
          topics[item.topic] = 1;
        }
      });
      const pieData = Object.entries(topics).map(([topic, count]) => ({ topic, count }));

        // Set up D3.js
        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const svg = d3.select(svgRef.current)
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie()
          .value(d => d.count)
          .sort(null);

        const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);

        const arcs = svg.selectAll('.arc')
          .data(pie(pieData))
          .enter()
          .append('g')
          .attr('class', 'arc');

        arcs.append('path')
          .attr('d', arc)
          .attr('fill', (d, i) => color(i))
          .style('transition', 'transform 0.2s ease-out') // Add transition effect
          .on('mouseover', function (event, d) {
            // Bouncing effect on hover
            d3.select(this)
              .transition()
              .duration(200)
              .attr('transform', `scale(1.1)`);

            // Display topic and count on hover with a changed font
            svg.append('text')
              .attr('class', 'tooltip')
              .attr('x', 0)
              .attr('y', 0)
              .attr('text-anchor', 'middle')
              .style('font-size', '18px') // Change font size
              .style('font-weight', 'bold')
              .style('fill', 'black')
              .text(`${d.data.topic}: ${d.data.count}`)
              .attr('transform', `translate(${arc.centroid(d)})`);
              // hoveredSegmentRef.current = d3.select(this);
          })
          .on('mouseout', function () {
            // Remove bouncing effect and tooltip on mouseout
            d3.select(this)
              .transition()
              .duration(200)
              .attr('transform', 'scale(1)');

            svg.select('.tooltip').remove();
            // Reset the hovered segment reference for the ByTopics component
        // hoveredSegmentRef.current = null;
          });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [ filterTopic, setCursorPosition ]);

  return (
    <>
    <h2>Pie Chart</h2>
    <svg ref={svgRef}></svg>
    </>
  );
}

export default TotalTopics;

