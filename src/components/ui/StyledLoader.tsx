import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BudgetLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center max-w-md">
        {/* Titre animé */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-purple-500 dark:text-purple-400">
            Chargement des données
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Préparation de votre tableau de bord
          </p>
        </motion.div>

        {/* Conteneur pour les graphiques animés */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* Graphique 1 - Violet (Crédits) */}
          <motion.div
            className="relative w-20 h-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e0d2ff"
                strokeWidth="12"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ 
                  strokeDashoffset: [251.2, 50, 150, 50, 251.2],
                  transition: { 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }
                }}
              />
            </svg>
          </motion.div>

          {/* Graphique 2 - Bleu (Charges) */}
          <motion.div
            className="relative w-20 h-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="12"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ 
                  strokeDashoffset: [251.2, 75, 175, 75, 251.2], 
                  transition: { 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.1
                  }
                }}
              />
            </svg>
          </motion.div>

          {/* Graphique 3 - Vert (Épargne) */}
          <motion.div
            className="relative w-20 h-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#dcfce7"
                strokeWidth="12"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4ade80"
                strokeWidth="12"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ 
                  strokeDashoffset: [251.2, 100, 200, 100, 251.2], 
                  transition: { 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }
                }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Points de chargement animés */}
        <motion.div 
          className="flex gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetLoader;
