
import { useState } from "react";
import { VehiclesList } from "./VehiclesList";
import { AddVehicleDialog } from "./AddVehicleDialog";
import { motion } from "framer-motion";

export const VehiclesContainer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.div
      className="container mx-auto py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex justify-between items-center mb-6"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-bold">Mes véhicules</h1>
          <p className="text-gray-500">Gérez vos véhicules et leurs dépenses</p>
        </div>
        <AddVehicleDialog />
      </motion.div>

      <motion.div variants={itemVariants}>
        <VehiclesList />
      </motion.div>
    </motion.div>
  );
};
