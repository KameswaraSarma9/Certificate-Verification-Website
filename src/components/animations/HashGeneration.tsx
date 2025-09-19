import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface HashGenerationProps {
  isActive?: boolean;
  inputData?: string;
  onHashGenerated?: (hash: string) => void;
}

export function HashGeneration({ isActive = false, inputData = "Certificate Data", onHashGenerated }: HashGenerationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hashChars, setHashChars] = useState<string[]>([]);
  const [finalHash, setFinalHash] = useState("");

  const hashingSteps = [
    "Preprocessing input data...",
    "Applying SHA-256 algorithm...",
    "Computing hash blocks...",
    "Finalizing cryptographic hash..."
  ];

  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
      setHashChars([]);
      
      const sequence = async () => {
        // Step through hashing process
        for (let step = 0; step < hashingSteps.length; step++) {
          setCurrentStep(step);
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Generate hash character by character
        const targetHash = "0x" + Math.random().toString(16).substr(2, 16).padEnd(16, '0');
        const chars = targetHash.split('');
        
        for (let i = 0; i < chars.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setHashChars(prev => [...prev, chars[i]]);
        }

        setFinalHash(targetHash);
        onHashGenerated?.(targetHash);
      };

      sequence();
    }
  }, [isActive, onHashGenerated]);

  return (
    <div className="relative h-40 bg-gradient-to-r from-emerald-900 to-teal-900 rounded-lg p-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Input data */}
        <div className="text-emerald-100 text-sm">
          <div className="text-emerald-300 mb-2">Input Data:</div>
          <motion.div 
            className="bg-emerald-800/50 p-2 rounded font-mono text-xs border border-emerald-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {inputData}
          </motion.div>
        </div>

        {/* Processing steps */}
        <div className="text-center">
          {isActive && (
            <motion.div
              className="text-emerald-200 text-sm mb-2"
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {hashingSteps[currentStep]}
            </motion.div>
          )}

          {/* Hash visualization */}
          <div className="flex justify-center items-center gap-1 mb-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 border border-emerald-400 rounded"
                initial={{ backgroundColor: "transparent" }}
                animate={{
                  backgroundColor: currentStep > 1 && isActive ? 
                    ["#10b981", "#059669", "#047857"] : "transparent"
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  repeat: currentStep > 1 && currentStep < 4 ? Infinity : 0,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>
        </div>

        {/* Generated hash */}
        <div className="text-emerald-100 text-sm">
          <div className="text-emerald-300 mb-2">Generated Hash:</div>
          <motion.div 
            className="bg-emerald-800/50 p-2 rounded font-mono text-xs border border-emerald-600 min-h-[24px] flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {hashChars.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                className="text-emerald-300"
              >
                {char}
              </motion.span>
            ))}
            {hashChars.length > 0 && hashChars.length < 18 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-emerald-400"
              >
                |
              </motion.span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Success checkmark */}
      {finalHash && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <motion.svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}