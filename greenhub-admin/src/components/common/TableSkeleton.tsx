import { motion } from "framer-motion";
import { TableCell, TableRow, TableBody } from "../ui/table";

export default function TableSkeleton() {
  return (
    <TableBody>
      {[1, 2, 3].map((i) => (
        <TableRow key={i} className="border-none">
          <TableCell colSpan={7} className="p-2">
            <motion.div
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatType: "reverse",
              }}
              className="h-11 w-full bg-gray-200/70 dark:bg-white/5 rounded-lg"
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}