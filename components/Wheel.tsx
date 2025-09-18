
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { scaleOrdinal, schemeTableau10, select, pie, arc, easeCubicOut } from 'd3';

export type WheelSegment = {
  text: string;
  type: 'item' | 'bonus_life' | 'bonus_points';
  isCorrect?: boolean;
};

interface WheelProps {
  segments: WheelSegment[];
  onSpinEnd: (segment: WheelSegment) => void;
}

const Wheel: React.FC<WheelProps> = ({ segments, onSpinEnd }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [spinning, setSpinning] = useState(false);
  const rotationRef = useRef(0);

  const numSegments = segments.length;
  const angle = 360 / numSegments;

  const drawWheel = useCallback(() => {
    const svg = select(ref.current);
    svg.selectAll("*").remove();
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;
    
    svg.attr('width', width).attr('height', height)
      .style('filter', 'drop-shadow(0 0 15px var(--highlight-neon-glow))');

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pieGenerator = pie<WheelSegment>().sort(null).value(() => 1);
    const arcGenerator = arc<any>().innerRadius(radius * 0.2).outerRadius(radius - 10);

    const segmentPaths = g.selectAll('.arc')
      .data(pieGenerator(segments))
      .enter().append('g')
      .attr('class', 'arc');

    segmentPaths.append('path')
      .attr('d', arcGenerator)
      .style('fill', d => {
          switch(d.data.type) {
              case 'bonus_life': return '#ef4444'; // Red-500
              case 'bonus_points': return '#f59e0b'; // Amber-500
              default: return 'rgba(20, 22, 33, 0.8)';
          }
      })
      .style('stroke', d => d.data.type.startsWith('bonus') ? '#FDE047' : 'var(--highlight-neon)')
      .style('stroke-width', 2);

    segmentPaths.append('text')
      .attr('transform', (d) => {
        const [x, y] = arcGenerator.centroid(d);
        const angle = (d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90;
        return `translate(${x}, ${y}) rotate(${angle})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('fill', d => d.data.type.startsWith('bonus') ? 'black' : 'var(--highlight-neon)')
      .style('font-size', '14px')
      .style('font-family', 'var(--font-body)')
      .style('font-weight', d => d.data.type.startsWith('bonus') ? 'bold' : 'normal')
      .text(d => d.data.text.length > 15 ? d.data.text.substring(0, 12) + '...' : d.data.text);

    // Arrow
    svg.append('path')
      .attr('d', `M${width/2 - 15},10 L${width/2 + 15},10 L${width/2},40 Z`)
      .style('fill', 'var(--highlight-neon)')
      .style('stroke', 'black')
      .style('stroke-width', 2);

  }, [segments]);


  useEffect(() => {
    if (ref.current) {
      drawWheel();
    }
  }, [drawWheel, segments]);
  
  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    const spinAngle = Math.floor(Math.random() * 360) + 360 * 5;
    const newRotation = rotationRef.current + spinAngle;
    rotationRef.current = newRotation;
    
    const svg = select(ref.current);
    svg.select('g')
      .transition()
      .duration(4000)
      .ease(easeCubicOut)
      .attr('transform', `translate(250,250) rotate(${newRotation})`)
      .on('end', () => {
        const finalAngle = newRotation % 360;
        const resultIndex = Math.floor((360 - finalAngle + angle/2) / angle) % numSegments;
        onSpinEnd(segments[resultIndex]);
        setSpinning(false);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <svg ref={ref}></svg>
      <button 
        onClick={spin} 
        disabled={spinning}
        className="mt-4 px-6 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-[var(--text-primary)] font-bold uppercase tracking-wider transition-all duration-300 hover:border-[var(--highlight-neon)] hover:text-[var(--highlight-neon)] hover:shadow-[0_0_15px_var(--highlight-neon-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--highlight-neon-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? 'Engaged...' : 'Engage'}
      </button>
    </div>
  );
};

export default Wheel;
