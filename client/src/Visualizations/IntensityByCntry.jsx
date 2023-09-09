import React, { useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";

function IntensityByCntry() {
    const svgRef = useRef(null);
  
    useEffect(() => {
      // Fetch data from the API
      axios.get('http://localhost:5000/api/data')
        .then(response => {
          const data = response.data;
  
          // Calculate total intensity for each country
          const countryIntensity = {};
          data.forEach(item => {
            if (countryIntensity[item.country]) {
              countryIntensity[item.country] += item.intensity;
            } else {
              countryIntensity[item.country] = item.intensity;
            }
          });
  
          // Convert country intensity data into an array of objects
          const intensityData = Object.entries(countryIntensity).map(([country, intensity]) => ({
            country,
            intensity,
          }));
  
          // Set up D3.js
          const width = 1000;
          const height = 500;
          const margin = { top: 20, right: 20, bottom: 30, left: 40 };
          const innerWidth = width - margin.left - margin.right;
          const innerHeight = height - margin.top - margin.bottom;
  
          const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);
  
          const x = d3.scaleBand()
            .domain(intensityData.map(d => d.country))
            .range([margin.left, innerWidth + margin.left])
            .padding(0.1);
  
          const y = d3.scaleLinear()
            .domain([0, d3.max(intensityData, d => d.intensity)])
            .nice()
            .range([innerHeight + margin.top, margin.top]);
  
          // Set a fixed range for the y-axis
          const yFixedRange = [innerHeight, 0];
          y.range(yFixedRange);
  
          const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
          const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('padding', '0.5rem')
            .style('border', '1px solid #ddd')
            .style('border-radius', '5px')
            .style('opacity', 0)
            .style('pointer-events', 'none'); // Prevent the tooltip from blocking the mouse interaction
  
          g.selectAll('.bar')
            .data(intensityData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.country))
            .attr('y', d => y(d.intensity))
            .attr('width', x.bandwidth())
            .attr('height', d => innerHeight - y(d.intensity))
            .attr('fill', 'lightgreen')
            .attr('opacity', 0.5)
            .on('mouseover', (event, d) => {
              d3.select(event.currentTarget).attr('fill', 'orange'); // Add hover effect
              tooltip.transition().duration(200).style('opacity', 1);
              tooltip.html(`Country: ${d.country}<br>Total Intensity: ${d.intensity}`)
                .style('left', `${event.pageX + 10}px`) // Adjust the position to the right
                .style('top', `${event.pageY - 30}px`);
            })
            .on('mouseout', (event) => {
              d3.select(event.currentTarget).attr('fill', 'lightgreen'); // Reset color on mouseout
              tooltip.transition().duration(200).style('opacity', 0);
            });
  
          // Add x and y axes
          g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll('.tick text')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-45)')
            .attr('dy', '0.25em');
  
          g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).ticks(7)); // Adjust the number of y-axis ticks as needed
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);
  
    return (
        <>
    <h2> By Intensity</h2>
    <svg ref={svgRef}></svg>
    </>
    );
  }
  
  export default IntensityByCntry;
  