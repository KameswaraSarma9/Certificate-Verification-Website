import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Database, CheckCircle, Clock } from "lucide-react";

interface Transaction {
  id: string;
  status: 'pending' | 'mining' | 'confirmed';
  from: string;
  to: string;
  data: string;
}

interface TransactionFlowProps {
  isActive?: boolean;
  transactionData?: any;
}

export function TransactionFlow({ isActive = false, transactionData }: TransactionFlowProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);

  useEffect(() => {
    if (isActive && transactionData) {
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        status: 'pending',
        from: 'Institution',
        to: 'Blockchain',
        data: `${transactionData.studentName} - ${transactionData.degreeProgram}`
      };

      setCurrentTx(newTransaction);
      setTransactions(prev => [...prev, newTransaction]);

      // Simulate transaction progression
      setTimeout(() => {
        setCurrentTx(prev => prev ? { ...prev, status: 'mining' } : null);
        setTransactions(prev => 
          prev.map(tx => tx.id === newTransaction.id ? { ...tx, status: 'mining' } : tx)
        );
      }, 1500);

      setTimeout(() => {
        setCurrentTx(prev => prev ? { ...prev, status: 'confirmed' } : null);
        setTransactions(prev => 
          prev.map(tx => tx.id === newTransaction.id ? { ...tx, status: 'confirmed' } : tx)
        );
      }, 4000);
    }
  }, [isActive, transactionData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'mining': return 'text-blue-400 bg-blue-400/20';
      case 'confirmed': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'mining': return Database;
      case 'confirmed': return CheckCircle;
      default: return Clock;
    }
  };

  return (
    <div className="relative h-56 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-4 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full gap-1">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-purple-300"
              animate={{
                opacity: isActive ? [0.1, 0.3, 0.1] : 0.1
              }}
              transition={{
                duration: 2,
                delay: (i % 8) * 0.1,
                repeat: Infinity
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full">
        {/* Header */}
        <div className="text-white mb-4">
          <h3 className="text-sm font-medium mb-1">Transaction Flow</h3>
          {currentTx && (
            <div className="text-xs text-purple-200">
              Transaction ID: {currentTx.id}
            </div>
          )}
        </div>

        {currentTx ? (
          <div className="space-y-4">
            {/* Transaction path visualization */}
            <div className="flex items-center justify-between relative">
              {/* From */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-blue-200">{currentTx.from}</div>
              </motion.div>

              {/* Arrow with transaction data */}
              <div className="flex-1 px-4">
                <motion.div
                  className="relative"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <ArrowRight className="w-6 h-6 text-purple-300 mx-auto" />
                  
                  {/* Data packet */}
                  <motion.div
                    className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-purple-700/50 p-2 rounded text-xs text-white max-w-32"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    {currentTx.data}
                  </motion.div>

                  {/* Moving particle */}
                  <motion.div
                    className="absolute top-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                    animate={currentTx.status !== 'pending' ? {
                      x: [0, 120],
                    } : {}}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: currentTx.status === 'mining' ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                  />
                </motion.div>
              </div>

              {/* To */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-purple-200">{currentTx.to}</div>
              </motion.div>
            </div>

            {/* Status indicator */}
            <motion.div
              className={`flex items-center gap-2 p-3 rounded-lg border ${getStatusColor(currentTx.status)}`}
              key={currentTx.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {(() => {
                const StatusIcon = getStatusIcon(currentTx.status);
                return <StatusIcon className="w-4 h-4" />;
              })()}
              <span className="text-sm font-medium">
                {currentTx.status === 'pending' && 'Transaction Pending'}
                {currentTx.status === 'mining' && 'Mining in Progress'}
                {currentTx.status === 'confirmed' && 'Transaction Confirmed'}
              </span>

              {/* Mining animation */}
              {currentTx.status === 'mining' && (
                <motion.div
                  className="ml-auto flex gap-1"
                  animate={{ opacity: [0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-4 bg-blue-400"
                      animate={{ height: [4, 16, 4] }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Block confirmation */}
            {currentTx.status === 'confirmed' && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="text-green-400 text-sm mb-2">
                  ✓ Added to Block #2,547,891
                </div>
                <div className="text-xs text-green-300">
                  6 confirmations • Immutable record created
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-purple-300 text-sm">
            Waiting for transaction...
          </div>
        )}
      </div>
    </div>
  );
}