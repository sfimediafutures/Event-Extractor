// import React from 'react';
// import { Progress } from "@/components/ui/progress";
// import { motion, AnimatePresence } from "framer-motion";

// const ProgressBar = ({ progress, modelDone }) => (
//   <div className="flex flex-col items-center h-full">
//     <div className="relative w-8 h-full bg-gray-200 rounded">
//       <motion.div
//         className={`absolute bottom-0 w-full ${progress === 100 ? 'bg-green-700' : 'bg-slate-500'} rounded`}
//         initial={{ height: 0 }}
//         animate={{ height: `${progress}%` }}
//         transition={{ duration: 0.5 }}
//       />
//     </div>

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressBar({ progress, modelDone }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-[400px] flex items-center relative">
        <div className="h-[400px] w-8 bg-secondary rounded-full overflow-hidden">
          <Progress 
            value={progress} 
            className="h-full w-full"
          />
        </div>
        {/* <div className="absolute right-0 h-full flex flex-col justify-between py-4">
          <div className="flex items-center">
            <div className="h-[2px] w-4 bg-slate-300"></div>
          </div>
          <div className="flex items-center">
            <div className="h-[2px] w-4 bg-slate-300"></div>
          </div>
          <div className="flex items-center">
            <div className="h-[2px] w-4 bg-slate-300"></div>
          </div>
          <div className="flex items-center">
            <div className="h-[2px] w-4 bg-slate-300"></div>
          </div>
        </div> */}
      </div>
      <AnimatePresence>
        {modelDone && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="text-green-600 font-semibold mt-2"
          >
            Done!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}