import { useRef, useState, useEffect } from 'react';
import us from '../states-albers-10m.json';
import * as topojson from 'topojson-client'; // Adjust this if needed
import * as d3 from 'd3';
import Tooltip from './Tooltip'

const SVGComponent = () => {
  const svgRef = useRef(null); // Ref to attach D3 logic to the SVG element
  const [ tooltipData, setTooltipData ] = useState('')
  const width = 975;
  const height = 610;

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;")
      .on("click", reset);

    const path = d3.geoPath();

    const g = svg.append("g");

    const states = g.append("g")
      .attr("fill", "#444")
      .attr("cursor", "pointer")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .join("path")
      .on("click", clicked)
      .attr("d", path);
    
    states.append("title")
      .text(d => d.properties.name);

    g.append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    svg.call(zoom);

    function reset() {
      states.transition().style("fill", null);
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }

    function clicked(event, d) {
        // console.log('clicked event', event)
        setTooltipData(event?.target?.textContent)
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      states.transition().style("fill", null);
      d3.select(this).transition().style("fill", "red");
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );
    }

    // const renderTooltip = (level, regionOrState) => {
    //     if (level === 'state') {
    //         return <Tooltip name={regionOrState} /> 
    //     }
    // }

    function zoomed(event) {
      const { transform } = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }

    // Cleanup the D3 component when the component unmounts
    return () => {
      svg.selectAll('*').remove(); // Remove all appended elements
    };
  }, []);

  return (
    <div className='relative'>
      <svg ref={svgRef}></svg>
      {tooltipData &&
        <Tooltip name={tooltipData} /> 
      }
    </div>
  );
};

export default SVGComponent;
