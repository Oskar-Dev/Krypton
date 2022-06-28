import React, { useEffect } from 'react';
import './index.scss';
import { evaluate, compile, range } from 'mathjs';
import { newPlot } from 'plotly.js-dist-min';

const App = () => {
  const renderGraph = () => {
    try {
      const expression = '1/x';
      const compiled = compile(expression);

      const xValues = range(-20, 20, 0.25).toArray();
      const yValues = xValues.map((x) => {
        return compiled.evaluate({ x: x });
      });

      const trace1 = {
        x: xValues,
        y: yValues,
        type: 'scatter',
      };

      const data = [trace1];
      newPlot('graph', data);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    renderGraph();
  }, []);

  return (
    <div className='container'>
      <div className='graphContainer'>
        <div id='graph' className='graph'></div>
      </div>
    </div>
  );
};

export default App;
