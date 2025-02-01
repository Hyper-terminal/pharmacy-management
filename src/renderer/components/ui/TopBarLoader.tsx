import { motion } from "framer-motion";

interface TopBarLoaderProps {
  text?: string;
}

export default function TopBarLoader({ text }: TopBarLoaderProps) {
  const borderVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  const textVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  return (
    <motion.div
      className="pointer-events-none"
      initial="initial"
      animate="animate"
    >
      {/* Top border */}
      <motion.div
        variants={borderVariants}
        className="fixed top-0 left-0 right-0 z-50 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700"
      >
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* Right border */}
      <motion.div
        variants={borderVariants}
        transition={{ delay: 0.1 }}
        className="fixed top-0 bottom-0 right-0 z-50 w-2 bg-gradient-to-t from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700"
      >
        <div className="absolute inset-0 animate-shimmer-vertical bg-gradient-to-t from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* Bottom border */}
      <motion.div
        variants={borderVariants}
        transition={{ delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-50 h-2 bg-gradient-to-l from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700"
      >
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-l from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* Left border */}
      <motion.div
        variants={borderVariants}
        transition={{ delay: 0.3 }}
        className="fixed top-0 bottom-0 left-0 z-50 w-2 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700"
      >
        <div className="absolute inset-0 animate-shimmer-vertical bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </motion.div>

      {/* Text container */}
      {(text || "Loading...") && (
        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.4
          }}
          className="fixed z-50 px-4 py-1 text-sm font-medium text-white -translate-x-1/2 rounded-lg top-3 left-1/2 backdrop-blur-sm bg-none"
        >
          <motion.div
            className="relative rounded-lg animate-border bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-full h-full px-4 py-1 rounded-lg bg-black/60">
              {text || "Loading..."}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
