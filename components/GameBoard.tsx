import React, { useMemo } from 'react';
import { Player } from '../types';
import { TOTAL_STEPS, PLAYER_CONFIG } from '../constants';
import { Trophy, Trees, Mountain, Cloud, Flag, Tent } from 'lucide-react';

interface GameBoardProps {
  players: Player[];
  currentPlayerId: number;
}

// Pseudo-random number generator for consistent map generation across renders
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const GameBoard: React.FC<GameBoardProps> = ({ players, currentPlayerId }) => {
  
  // 1. Generate Organic Path Nodes
  const { pathPoints, decorations } = useMemo(() => {
    const points: { index: number; x: number; y: number }[] = [];
    const rows = 5;
    const cols = 5;
    const xStep = 100 / cols;
    const yStep = 100 / rows;
    
    // Generate path points with randomness
    for (let i = 0; i < TOTAL_STEPS; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const isEvenRow = row % 2 === 0;

        // Base Grid Position
        // Flip column for snake effect
        let baseX = (isEvenRow ? col : (cols - 1 - col)) * xStep + (xStep / 2);
        let baseY = (rows - 1 - row) * yStep + (yStep / 2); // Start from bottom

        // Add Randomness (Wiggle)
        // We use the index as a seed so it's consistent
        const rX = (seededRandom(i * 13) - 0.5) * (xStep * 0.6); 
        const rY = (seededRandom(i * 7) - 0.5) * (yStep * 0.6);

        points.push({
            index: i,
            x: baseX + rX,
            y: baseY + rY
        });
    }

    // Generate Decor (Background elements)
    const decors: { id: number; x: number; y: number; type: string; scale: number, rotation: number }[] = [];
    for(let k = 0; k < 15; k++) {
        const x = seededRandom(k * 123) * 100;
        const y = seededRandom(k * 456) * 100;
        // Avoid placing too close to path points (simple check)
        const tooClose = points.some(p => Math.hypot(p.x - x, p.y - y) < 8);
        
        if (!tooClose) {
            const types = ['tree', 'tree', 'mountain', 'cloud', 'tent', 'flower'];
            const type = types[Math.floor(seededRandom(k * 99) * types.length)];
            decors.push({
                id: k,
                x,
                y,
                type,
                scale: 0.5 + seededRandom(k * 88) * 0.8,
                rotation: (seededRandom(k*22) - 0.5) * 20
            });
        }
    }

    return { pathPoints: points, decorations: decors };
  }, []);

  // 2. Generate Smooth SVG Path Data (Bezier)
  const pathData = useMemo(() => {
    if (pathPoints.length === 0) return "";
    let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    
    for (let i = 0; i < pathPoints.length - 1; i++) {
        const p1 = pathPoints[i];
        const p2 = pathPoints[i + 1];
        
        // Simple smoothing: control point is midpoint
        // For better smoothing, we could calculate vectors, but straight L is boring, 
        // Q (Quadratic) or C (Cubic) is better.
        // Let's use a simple curve strategy: average points?
        // Actually, just a simple Catmull-Rom or just curving through midpoints.
        
        // Let's do a simple cubic bezier using previous and next points logic would be complex for this snippet.
        // Simplified: Curvy line between points
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        
        // Add a bit of perpendicular offset for "winding" look?
        // Let's stick to simple lines for reliability, but use 'S' command if we had control points.
        // Or just Line to Line.
        // Let's try Quad bezier to midpoint? No, plain line is safest if we want nodes to be exactly ON the line.
        // But we can just use "L" and rely on the node placement to make it look winding.
        d += ` L ${p2.x} ${p2.y}`;
    }
    return d;
  }, [pathPoints]);


  return (
    <div className="w-full max-w-4xl mx-auto aspect-[4/3] relative rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-800/20 bg-[#eef5e6]">
        {/* Background Gradient/Pattern */}
        <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #fdfbf7 0%, #e2e8c0 100%)'
        }}></div>

        {/* SVG Container for the Map */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            
            {/* 1. Decorations (Bottom Layer) */}
            {decorations.map(d => {
                // Render different icons based on type
                let Icon = Trees;
                let color = "#88aa77";
                if (d.type === 'mountain') { Icon = Mountain; color = "#aabbaa"; }
                if (d.type === 'cloud') { Icon = Cloud; color = "#ffffff"; }
                if (d.type === 'tent') { Icon = Tent; color = "#d98850"; }
                
                // Cloud special handling for animation
                const isCloud = d.type === 'cloud';
                
                return (
                    <g key={d.id} transform={`translate(${d.x}, ${d.y}) scale(${d.scale}) rotate(${d.rotation})`}>
                       <foreignObject width="20" height="20" x="-10" y="-10" 
                         className={isCloud ? "animate-float-slow opacity-80" : ""}
                       >
                           <div className="flex items-center justify-center w-full h-full">
                             <Icon 
                                size={12} 
                                color={color} 
                                fill={isCloud ? "white" : (d.type === 'mountain' ? '#eef' : 'currentColor')} 
                                className="opacity-80"
                             />
                           </div>
                       </foreignObject>
                    </g>
                );
            })}

            {/* 2. The Path (Dashed Line) */}
            {/* Shadow path */}
            <path d={pathData} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" transform="translate(1, 1)" />
            {/* Main path */}
            <path d={pathData} fill="none" stroke="#d4cba3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathData} fill="none" stroke="#a69875" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" strokeLinejoin="round" />

            {/* 3. Nodes */}
            {pathPoints.map((point) => {
                const isStart = point.index === 0;
                const isFinish = point.index === TOTAL_STEPS - 1;
                const p1Here = players[0].position === point.index;
                const p2Here = players[1].position === point.index;

                // Node Color
                let fill = "#fff";
                let stroke = "#a69875";
                let radius = 3;

                if (isStart) { fill = "#bbf7d0"; stroke = "#22c55e"; radius = 4; }
                if (isFinish) { fill = "#fef08a"; stroke = "#eab308"; radius = 5; }

                return (
                    <g key={point.index}>
                        {/* Connection Dot */}
                        <circle cx={point.x} cy={point.y} r={radius} fill={fill} stroke={stroke} strokeWidth="0.8" />
                        
                        {/* Step Number (Only every 5 steps to avoid clutter, or all small) */}
                        <text x={point.x} y={point.y + (isFinish ? 0 : 5)} fontSize="3" textAnchor="middle" fill="#9ca3af" fontWeight="bold" dy="0.3em" className="select-none pointer-events-none">
                            {isFinish ? '' : point.index}
                        </text>

                        {/* Finish Flag */}
                        {isFinish && (
                             <g transform={`translate(${point.x - 4}, ${point.y - 8}) scale(0.3)`}>
                                 <foreignObject width="24" height="24">
                                     <Trophy className="text-yellow-600 fill-yellow-400 w-full h-full" />
                                 </foreignObject>
                             </g>
                        )}
                         {isStart && (
                             <g transform={`translate(${point.x - 3}, ${point.y - 7}) scale(0.25)`}>
                                 <foreignObject width="24" height="24">
                                     <Flag className="text-green-600 fill-green-400 w-full h-full" />
                                 </foreignObject>
                             </g>
                        )}
                    </g>
                );
            })}
        </svg>

        {/* 4. Players Layer (Using absolute divs on top for easier Z-index/Animation management than pure SVG) */}
        {players.map((p, idx) => {
            const point = pathPoints[p.position];
            if (!point) return null;
            
            // Offset slightly if both players on same spot
            const isShared = players[0].position === players[1].position;
            const offsetX = isShared ? (idx === 0 ? -2 : 2) : 0;
            const offsetY = isShared ? 1 : 0; // Move down a bit to see node

            return (
                <div 
                    key={p.id}
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 transition-all duration-500 ease-in-out"
                    style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        marginLeft: `${offsetX}%`,
                        marginTop: `${offsetY}%`,
                        transform: 'translate(-50%, -50%)', // Center on point
                    }}
                >
                    {/* Active Player Indicator Ring */}
                    {currentPlayerId === p.id && (
                        <div className={`absolute inset-0 rounded-full animate-pulse-ring ${p.color}`}></div>
                    )}
                    
                    {/* Pawn Body */}
                    <div className={`
                        relative w-full h-full rounded-full border-2 border-white shadow-lg 
                        flex items-center justify-center text-white font-bold text-sm sm:text-base
                        ${p.color} ring-2 ring-black/10 z-10 transform hover:scale-110 transition-transform
                        ${currentPlayerId === p.id ? 'animate-bounce' : ''}
                    `}>
                        {p.id + 1}
                        {/* Pawn Head (visual detail) */}
                        <div className="absolute -top-1 w-full h-full rounded-full bg-white opacity-20 transform scale-75 origin-top"></div>
                    </div>
                </div>
            );
        })}
    </div>
  );
};
