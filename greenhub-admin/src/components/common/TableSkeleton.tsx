import { motion } from "framer-motion";

export default function TableSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
      className="w-full space-y-4"
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-14 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      ))}
    </motion.div>
  );
}