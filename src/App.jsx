import { useEffect } from 'react'
// import us from '../states-albers-10m.json'
// import * as topojson from 'topojson'
import * as d3 from 'd3';
import { USAMap } from '@mirawision/usa-map-react';
import SVGComponent from './MapSvg'
import './App.css'

const GeophysicalSubLayer = () => {
  useEffect(() => {
    const svg = d3.select('#geophysical-layer')
    d3.json('../us-states.json').then((data) => {
      console.log('geo data', data)
      const projection = d3.geoAlbersUsa().scale(1000).translate([500, 300]);

      // Create a path generator
      const pathGenerator = d3.geoPath(projection, data?.features)
  
      // Render each state's polygon (this assumes you have multiple states in your data)
      svg
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', (d) => pathGenerator(d)) // Generate the path for each state's polygon
        .attr('fill', 'none') // Use 'none' for just borders
        .attr('stroke', 'blue') // Customize the color for state boundaries
        .attr('stroke-width', 0.8);
      svg
        .selectAll('polygon')
        .data(data.features)
        .enter()
        .append('polygon')
        .attr('d', pathGenerator)
        .attr('fill', (d) => {
          // Example for adding a color scale based on elevation
          const elevation = d.properties.elevation || 0; // Replace with actual property from GeoJSON
          return d3.interpolateGreens(elevation / 1000); // Scale based on elevation
        })
        .attr('opacity', 0.6); 
    })
  }, [])
  return <svg id="geophysical-layer" fill='#000' style={{ position: 'absolute', top: 0, left: 0 }} />;
}

function App() {
  
  const handleStateClick = (stateAbbreviation) => {
    console.log(`You clicked on ${stateAbbreviation}`);
  };
  
  const customStates = {
    CA: {
      fill: 'red',
      onClick: handleStateClick,
    },
    TX: {
      fill: 'blue',
      stroke: 'green',
      onClick: handleStateClick,
    },
  };


  return (
    <>
      <div className='font-bold'>checking</div>
      <USAMap customStates={customStates} />
      <GeophysicalSubLayer />
      <SVGComponent />
    </>
  )
}

export default App