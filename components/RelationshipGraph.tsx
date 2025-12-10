
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AppEntity, EntityType } from '../types';

interface RelationshipGraphProps {
  data: AppEntity[];
  onNodeClick: (id: string) => void;
  width?: number;
  height?: number;
  lang: 'en' | 'zh';
}

const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ data, onNodeClick, width = 800, height = 600, lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Transform data into nodes and links
    // We clone to avoid mutating original props directly in D3 simulation
    const nodes = data.map(d => ({ ...d }));
    const links: any[] = [];

    data.forEach(sourceNode => {
      sourceNode.linked_ids.forEach(targetId => {
        // Ensure target exists in current dataset to avoid d3 errors
        if (data.find(d => d.id === targetId)) {
            links.push({ source: sourceNode.id, target: targetId });
        }
      });
    });

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Explicit Color Map for Entity Types
    const typeColors: Record<string, string> = {
      [EntityType.LORE]: '#a855f7', // Purple
      [EntityType.ASSET]: '#3b82f6', // Blue
      [EntityType.AI]: '#10b981',    // Green
      [EntityType.CODE]: '#f59e0b',  // Yellow
      [EntityType.TASK]: '#ef4444'   // Red
    };

    // Draw Links
    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    // Draw Nodes Group
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Node Circles
    node.append("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => typeColors[d.type] || '#cbd5e1')
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("click", (event, d) => onNodeClick(d.id))
      .style("cursor", "pointer");

    // Node Labels
    node.append("text")
      .text((d: any) => {
        // Localized title logic
        const title = (lang === 'zh' && d.title_zh) ? d.title_zh : d.title;
        return title.substring(0, 15) + (title.length > 15 ? "..." : "");
      })
      .attr("x", 14)
      .attr("y", 4)
      .attr("font-size", "10px")
      .attr("fill", "#cbd5e1")
      .style("pointer-events", "none");

    // Icon (Simple representation using first letter)
    node.append("text")
       .text((d: any) => d.type ? d.type[0].toUpperCase() : '?')
       .attr("x", 0)
       .attr("y", 3)
       .attr("text-anchor", "middle")
       .attr("font-size", "8px")
       .attr("fill", "white")
       .attr("font-weight", "bold")
       .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, width, height, onNodeClick, lang]); // Added lang dependency

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden shadow-inner border border-slate-700">
      <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} />
    </div>
  );
};

export default RelationshipGraph;
