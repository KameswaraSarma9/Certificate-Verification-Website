import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Shield, Lock, Key, CheckCircle2 } from "lucide-react";

interface CryptographicSecurityProps {
  isActive?: boolean;
  securityLevel?: 'low' | 'medium' | 'high';
}

export function CryptographicSecurity({ isActive = false, securityLevel = 'high' }: CryptographicSecurityProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [encryptionBits, setEncryptionBits] = useState<boolean[]>([]);

  const phases = [
    { name: "Digital Signature", icon: Key, color: "text-blue-400" },
    { name: "Hash Verification", icon: Shield, color: "text-green-400" },
    { name: "Encryption Lock", icon: Lock, color: "text-purple-400" },
    { name: "Security Verified", icon: CheckCircle2, color: "text-emerald-400" }
  ];

  const securityColors = {
    low: "from-red-600 to-orange-600",
    medium: "from-yellow-600 to-orange-600", 
    high: "from-green-600 to-emerald-600"
  };

  useEffect(() => {
    if (isActive) {
      setCurrentPhase(0);
      
      // Generate random encryption pattern
      const bits = Array.from({ length: 128 }, () => Math.random() > 0.5);
      setEncryptionBits(bits);

      // Cycle through security phases
      const phaseInterval = setInterval(() => {
        setCurrentPhase(prev => {
          if (prev < phases.length - 1) {
            return prev + 1;
          } else {
            clearInterval(phaseInterval);
            return prev;
          }
        });
      }, 1200);

      return () => clearInterval(phaseInterval);
    }
  }, [isActive]);

  return (
    <div className={`relative h-48 bg-gradient-to-br ${securityColors[securityLevel]} rounded-lg p-4 overflow-hidden`}>
      {/* Background encryption pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-16 gap-1 h-full">
          {encryptionBits.map((bit, index) => (
            <motion.div
              key={index}
              className={`w-full h-2 ${bit ? 'bg-white' : 'bg-transparent'}`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isActive ? [0, 1, 0] : 0,
                backgroundColor: bit ? '#ffffff' : 'transparent'
              }}
              transition={{
                duration: 0.5,
                delay: (index % 16) * 0.05,
                repeat: isActive ? Infinity : 0,
                repeatDelay: 2
              }}
            />
          ))}
        </div>
      </div>

      {/* Central security hub */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Main security shield */}
        <motion.div
          className="relative mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: isActive ? 1 : 0.8 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40"
            animate={isActive ? {
              rotate: [0, 360],
              borderColor: ["rgba(255,255,255,0.4)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.4)"]
            } : {}}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 2, repeat: Infinity }
            }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>

          {/* Security rings */}
          {Array.from({ length: 3 }).map((_, ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 border border-white/30 rounded-full"
              style={{
                width: `${80 + ring * 20}px`,
                height: `${80 + ring * 20}px`,
                left: `${-10 - ring * 10}px`,
                top: `${-10 - ring * 10}px`
              }}
              animate={isActive ? {
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.7, 0.3]
              } : {}}
              transition={{
                duration: 2,
                delay: ring * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Security phases */}
        <div className="text-center">
          <motion.div
            key={currentPhase}
            className="flex items-center gap-2 text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {phases[currentPhase] && (
              <>
                <phases[currentPhase].icon className={`w-5 h-5 ${phases[currentPhase].color}`} />
                <span className="text-sm font-medium">{phases[currentPhase].name}</span>
              </>
            )}
          </motion.div>

          {/* Progress indicators */}
          <div className="flex gap-2 justify-center">
            {phases.map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full border border-white/40"
                animate={{
                  backgroundColor: index <= currentPhase ? '#ffffff' : 'transparent',
                  scale: index === currentPhase ? [1, 1.2, 1] : 1
                }}
                transition={{
                  scale: { duration: 0.5, repeat: index === currentPhase ? Infinity : 0 }
                }}
              />
            ))}
          </div>
        </div>

        {/* Security level indicator */}
        <motion.div
          className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded text-xs text-white font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {securityLevel.toUpperCase()} SECURITY
        </motion.div>

        {/* Floating security particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={isActive ? {
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            } : {}}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}