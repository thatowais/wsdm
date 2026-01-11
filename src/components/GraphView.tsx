import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { Note } from '../types/note';
import { useNavigate } from 'react-router-dom';

interface GraphViewProps {
  notes: Note[];
  onNodeClick: (note: Note) => void;
  onConnectionCreate?: (sourceId: string, targetId: string) => void;
}

interface GraphNode {
  id: string;
  name: string;
  val: number;
  group: 'fleeting' | 'literature' | 'permanent' | 'tag';
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
  color?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function GraphView({ notes, onNodeClick }: GraphViewProps) {
  const fgRef = useRef<ForceGraphMethods>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const data = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const tagSet = new Set<string>();

    // Process notes
    notes.forEach(note => {
      nodes.push({
        id: note.id,
        name: note.title || 'Untitled',
        val: 20, // Size
        group: note.type,
        color: note.type === 'permanent' ? '#3b82f6' : note.type === 'literature' ? '#10b981' : '#f59e0b'
      });

      // Collect tags
      note.tags.forEach(tag => tagSet.add(tag));

      // Process connections (explicit)
      note.connections.forEach(targetId => {
        if (notes.some(n => n.id === targetId)) {
          links.push({
            source: note.id,
            target: targetId,
            color: '#94a3b8' // Darker slate for better visibility
          });
        }
      });

      // Process mentions (backlinks)
      const mentionRegex = /data-mention-id="([^"]+)"/g;
      let match;
      while ((match = mentionRegex.exec(note.content)) !== null) {
        const targetId = match[1];
        if (notes.some(n => n.id === targetId) && targetId !== note.id) {
          const exists = links.some(l => (l.source === note.id && l.target === targetId) || (l.source === targetId && l.target === note.id));
          if (!exists) {
            links.push({
              source: note.id,
              target: targetId,
              color: '#94a3b8'
            });
          }
        }
      }
    });

    // Process tags
    tagSet.forEach(tag => {
      const tagId = `tag-${tag}`;
      nodes.push({
        id: tagId,
        name: `#${tag}`,
        val: 15,
        group: 'tag',
        color: '#64748b' // Slate-500 for tags
      });

      // Link notes to tags
      notes.forEach(note => {
        if (note.tags.includes(tag)) {
          links.push({
            source: note.id,
            target: tagId,
            color: '#cbd5e1' // Lighter for tag connections
          });
        }
      });
    });

    // Calculate node sizes based on connections
    const nodeSizes = new Map<string, number>();
    links.forEach(link => {
      const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
      nodeSizes.set(targetId, (nodeSizes.get(targetId) || 0) + 1);
    });

    nodes.forEach(node => {
      if (node.group !== 'tag') {
        const connectionCount = nodeSizes.get(node.id) || 0;
        // Base size 20, add 2 for each connection, cap at 50
        node.val = Math.min(50, 20 + (connectionCount * 2));
      }
    });

    return { nodes, links };
  }, [notes]);

  const handleNodeClick = useCallback((node: any) => {
    if (node.group !== 'tag') {
      const note = notes.find(n => n.id === node.id);
      if (note) {
        onNodeClick(note);
      }
    } else {
      fgRef.current?.zoomToFit(400, 10, (n: any) => n.id === node.id || n.group === 'tag');
    }
  }, [notes, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-50 overflow-hidden">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        nodeLabel="name"
        nodeColor="color"
        nodeRelSize={6}
        linkColor="color"
        linkWidth={1.5}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400)}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          // Draw Node
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color;
          ctx.fill();

          // Draw Label
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#1e293b'; // Slate-800
          ctx.fillText(label, node.x, node.y + 8); // Offset text below node

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        }}
        nodePointerAreaPaint={(node: any, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
        }}
      />
    </div>
  );
}