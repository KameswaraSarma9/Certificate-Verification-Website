import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Node {
  id: number;
  x: number;
  y: number;
  connected: boolean;
  isValidator: boolean;
}

interface NetworkNodesProps {
  isActive?: boolean;
  showValidation?: boolean;
}

export function NetworkNodes({ isActive = false, showValidation = false }: NetworkNodesProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<number[][]>([]);
  const [validatingNode, setValidatingNode] = useState<number | null>(null);

  useEffect(() => {
    // Generate network nodes
    const nodeCount = 8;
    const newNodes: Node[] = [];
    const newConnections: number[][] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const radius = 80;
      newNodes.push({
        id: i,
        x: 120 + radius * Math.cos(angle),
        y: 100 + radius * Math.sin(angle),
        connected: false,
        isValidator: i % 3 === 0
      });
    }

    // Create connections
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.4) {
          newConnections.push([i, j]);
        }
      }
    }

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  useEffect(() => {
    if (isActive && showValidation) {
      // Simulate consensus validation
      const validators = nodes.filter(node => node.isValidator);
      let currentValidator = 0;

      const validateNext = () => {
        if (currentValidator < validators.length) {
          setValidatingNode(validators[currentValidator].id);
          setTimeout(() => {
            setValidatingNode(null);
            currentValidator++;
            setTimeout(validateNext, 500);
          }, 1000);
        }
      };

      setTimeout(validateNext, 1000);
    }
  }, [isActive, showValidation, nodes]);

  return (
    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg">
      <svg className="w-full h-full">
        {/* Connections */}
        {connections.map(([from, to], index) => (
          <motion.line
            key={`connection-${from}-${to}`}
            x1={nodes[from]?.x}
            y1={nodes[from]?.y}
            x2={nodes[to]?.x}
            y2={nodes[to]?.y}
            stroke="#4f46e5"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: isActive ? 1 : 0.3, 
              opacity: isActive ? 0.6 : 0.3 
            }}
            transition={{ 
              delay: index * 0.1, 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Data packets */}
        {isActive && connections.map(([from, to], index) => (
          <motion.circle
            key={`packet-${from}-${to}`}
            r="2"
            fill="#00d4ff"
            initial={{ 
              cx: nodes[from]?.x, 
              cy: nodes[from]?.y,
              opacity: 0
            }}
            animate={{
              cx: [nodes[from]?.x, nodes[to]?.x],
              cy: [nodes[from]?.y, nodes[to]?.y],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: index * 0.3,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.g key={node.id}>
            {/* Node glow for validators */}
            {node.isValidator && validatingNode === node.id && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                initial={{ r: 8, opacity: 1 }}
                animate={{ r: 25, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            
            {/* Main node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="8"
              fill={node.isValidator ? "#f59e0b" : "#3b82f6"}
              stroke={validatingNode === node.id ? "#fbbf24" : "#1e40af"}
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ 
                scale: isActive ? 1.2 : 1,
                fill: validatingNode === node.id ? "#fbbf24" : 
                      (node.isValidator ? "#f59e0b" : "#3b82f6")
              }}
              transition={{ 
                delay: node.id * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.5 }}
            />
            
            {/* Node ID */}
            <motion.text
              x={node.x}
              y={node.y + 3}
              textAnchor="middle"
              fill="white"
              fontSize="8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: node.id * 0.1 + 0.5 }}
            >
              {node.id}
            </motion.text>
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 text-xs text-white/70">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Network Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Validator Node</span>
        </div>
      </div>

      {/* Status indicator */}
      {showValidation && (
        <motion.div
          className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 border border-green-400 rounded text-xs text-green-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Consensus in Progress
        </motion.div>
      )}
    </div>
  );
}