import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Block {
  id: number;
  hash: string;
  previousHash: string;
  data: string;
  timestamp: number;
}

interface BlockchainVisualizationProps {
  isActive?: boolean;
  newBlock?: any;
}

export function BlockchainVisualization({ isActive = false, newBlock }: BlockchainVisualizationProps) {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 0,
      hash: "0x000...genesis",
      previousHash: "0x000000000",
      data: "Genesis Block",
      timestamp: Date.now() - 10000
    },
    {
      id: 1,
      hash: "0x1a2b3c4d5e",
      previousHash: "0x000...genesis",
      data: "MIT-CS-2023-001",
      timestamp: Date.now() - 5000
    }
  ]);

  useEffect(() => {
    if (newBlock && isActive) {
      const newBlockData: Block = {
        id: blocks.length,
        hash: `0x${Math.random().toString(16).substr(2, 10)}`,
        previousHash: blocks[blocks.length - 1].hash,
        data: `${newBlock.institutionName}-${newBlock.degreeProgram}`,
        timestamp: Date.now()
      };

      setTimeout(() => {
        setBlocks(prev => [...prev, newBlockData]);
      }, 1000);
    }
  }, [newBlock, isActive, blocks.length]);

  return (
    <div className="relative h-64 overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <motion.div 
        className="flex items-center space-x-4 h-full"
        animate={isActive ? { x: -100 } : { x: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={index === blocks.length - 1 ? { scale: 0, opacity: 0 } : {}}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: index === blocks.length - 1 ? 1 : 0,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            className="relative"
          >
            {/* Block */}
            <motion.div
              className="bg-blue-600 p-4 rounded-lg shadow-lg min-w-[140px] border-2 border-blue-400"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              style={{
                background: index === blocks.length - 1 ? 
                  "linear-gradient(135deg, #3b82f6, #1d4ed8)" : 
                  "linear-gradient(135deg, #1e293b, #334155)"
              }}
            >
              <div className="text-white text-xs space-y-1">
                <div className="font-mono">Block #{block.id}</div>
                <div className="truncate">Hash: {block.hash}</div>
                <div className="truncate">Prev: {block.previousHash}</div>
                <div className="text-blue-200">{block.data}</div>
              </div>
              
              {/* Block glow effect */}
              {index === blocks.length - 1 && (
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-lg"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Chain link */}
            {index < blocks.length - 1 && (
              <motion.div
                className="absolute top-1/2 -right-6 w-8 h-1 bg-cyan-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.div
                  className="w-full h-full bg-cyan-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full"
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 200,
            opacity: 0
          }}
          animate={{
            y: [null, -50, null],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}