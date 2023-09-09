import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CntrywithRel from './Visualizations/CntrywithRel';
import IntensityByCntry from './Visualizations/IntensityByCntry';
import ByTopics from './Filtering/ByTopics';

function DashBoard() {
  return (
    <div style={{ padding: 16, background: '#2c3e50' }}>
      <h1>Visualization Dashboard</h1>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
          <Paper style={{ padding: 16, textAlign: 'center', background: '#34495e' }}>
            <ByTopics />
          </Paper>
        </Grid>
   
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: 16, textAlign: 'center', background: '#34495e' }}>
            <CntrywithRel />
          </Paper>
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <Paper style={{ padding: 16, textAlign: 'center', background: '#34495e' }}>
            <IntensityByCntry />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default DashBoard;
