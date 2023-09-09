// ByTopics.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TotalTopics from '../Visualizations/TotalTopics';

function ByTopics() {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [cursorPosition, setCursorPosition] = useState('');
    const hoveredSegmentRef = useRef(null); // Reference to the hovered segment
  

  useEffect(() => {
    // Fetch list of unique topics from the API
    axios.get('http://localhost:5000/api/data')
      .then(response => {
        const data = response.data;
        const uniqueTopics = [...new Set(data.map(item => item.topic))];
        setTopics(uniqueTopics);
      })
      .catch(error => {
        console.error('Error fetching topics:', error);
      });
  }, []);

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
    setCursorPosition(''); // Reset cursor position when changing the filter
  };

  return (
    <div>
      <h2>Filter By Topics</h2>
      <div>
        <label htmlFor="topic"> <i><b>Select a Topic:</b></i> </label>
        <select id="topic" value={selectedTopic} onChange={handleTopicChange}>
          <option value="">All Topics</option>
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <TotalTopics filterTopic={selectedTopic} setCursorPosition={setCursorPosition} hoveredSegmentRef={hoveredSegmentRef} />
    </div>
  );
}

export default ByTopics;
