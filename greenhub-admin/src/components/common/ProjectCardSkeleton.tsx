import { motion } from "framer-motion";

export default function ProjectCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 w-full">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden p-4 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          </div>
          {/* Title & Desc */}
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
          {/* Media Area */}
          <div className="aspect-[3.5/1] w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </motion.div>
      ))}
    </div>
  );
}