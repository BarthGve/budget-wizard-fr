
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const StyledLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center max-w-md">
        {/* Titre avec animation simplifiée */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-primary-500 dark:text-primary-400">
            Chargement des données
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Préparation de votre tableau de bord
          </p>
        </motion.div>

        {/* Conteneur pour les graphiques animés - animations simplifiées */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* Graphique 1 - Violet (Crédits) */}
          <motion.div
            className="relative w-20 h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
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
                animate={{ strokeDashoffset: 125 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut" 
                }}
              />
            </svg>
          </motion.div>

          {/* Graphique 2 - Bleu (Charges) */}
          <motion.div
            className="relative w-20 h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
                animate={{ strokeDashoffset: 75 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>

          {/* Graphique 3 - Vert (Épargne) */}
          <motion.div
            className="relative w-20 h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
                animate={{ strokeDashoffset: 125 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Points de chargement avec animations simplifiées */}
        <div className="flex gap-2 mt-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400"
              animate={{
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
        </div>
      </div>
    </div>
  );
};

export default StyledLoader;
