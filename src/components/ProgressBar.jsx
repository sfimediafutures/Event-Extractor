import React from 'react';
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const ProgressBar = ({ progress, modelDone }) => (
  <div className="mb-4 flex items-center">
    <Progress value={progress} className="w-full h-4 mr-4" />
    <AnimatePresence>
      {modelDone && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="text-green-600 font-semibold"
        >
          Done!
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

export default ProgressBar;