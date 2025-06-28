'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface CountyData {
  geoid: string;
  value: number;
  name: string;
}

export default function GeorgiaMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [countyData, setCountyData] = useState<Map<string, CountyData>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false immediately since we're using placeholder data
    setLoading(false);

    if (!svgRef.current) return;

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create a group for the map
    const mapGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Sample data - replace with actual water system data
    const sampleData = new Map<string, CountyData>([
      ['13121', { geoid: '13121', value: 85, name: 'Fulton County' }],
      ['13089', { geoid: '13089', value: 72, name: 'DeKalb County' }],
      ['13135', { geoid: '13135', value: 68, name: 'Gwinnett County' }],
      ['13067', { geoid: '13067', value: 91, name: 'Cobb County' }],
      ['13063', { geoid: '13063', value: 45, name: 'Clayton County' }],
    ]);
    setCountyData(sampleData);

    // Color scale
    const colorScale = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateBlues);

    // Draw placeholder rectangles for counties
    const placeholderCounties = [
      { x: 300, y: 150, width: 100, height: 80, name: 'Fulton', geoid: '13121' },
      { x: 400, y: 160, width: 90, height: 70, name: 'DeKalb', geoid: '13089' },
      { x: 410, y: 100, width: 95, height: 60, name: 'Gwinnett', geoid: '13135' },
      { x: 280, y: 170, width: 85, height: 65, name: 'Cobb', geoid: '13067' },
      { x: 340, y: 230, width: 70, height: 55, name: 'Clayton', geoid: '13063' },
    ];

    const counties = mapGroup
      .selectAll('g.county')
      .data(placeholderCounties)
      .enter()
      .append('g')
      .attr('class', 'county');

    counties
      .append('rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', (d) => d.width)
      .attr('height', (d) => d.height)
      .attr('fill', (d) => {
        const data = sampleData.get(d.geoid);
        return data ? colorScale(data.value) : '#ccc';
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 2).attr('stroke', '#000');

        // Show tooltip
        const data = sampleData.get(d.geoid);
        const value = data ? data.value : 'No data';

        const tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'map-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('opacity', 0);

        tooltip.transition().duration(200).style('opacity', 1);

        tooltip
          .html(`<strong>${d.name}</strong><br/>Value: ${value}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', 1).attr('stroke', '#333');

        d3.selectAll('.map-tooltip').remove();
      });

    counties
      .append('text')
      .attr('x', (d) => d.x + d.width / 2)
      .attr('y', (d) => d.y + d.height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .style('pointer-events', 'none')
      .text((d) => d.name);

    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;

    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - legendWidth - 40}, ${height - 60})`);

    // Create gradient for legend
    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient').attr('id', 'legend-gradient');

    // Add gradient stops
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      linearGradient
        .append('stop')
        .attr('offset', `${(i * 100) / numStops}%`)
        .attr('stop-color', colorScale((i * 100) / numStops));
    }

    // Draw gradient rect
    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    // Add legend labels
    legend
      .append('text')
      .attr('x', 0)
      .attr('y', -5)
      .attr('font-size', '12px')
      .text('Water Quality Score');

    legend
      .append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 15)
      .attr('font-size', '10px')
      .text('0');

    legend
      .append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 15)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .text('100');

    // Note for actual implementation
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#666')
      .text('Note: This is a placeholder visualization. Real Georgia county boundaries needed.');
  }, [countyData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading map: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Water System Data by County</h2>
        <p className="text-sm text-gray-600 mt-1">Hover over counties to see details</p>
      </div>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
