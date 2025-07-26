import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Generate random sparkles (reduced count for better performance)
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      for (let i = 0; i < 25; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 15 + 8,
          delay: Math.random() * 1.5,
          duration: Math.random() * 1.5 + 0.8,
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();

    // Show text after a short delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 300);

    // Complete welcome screen after animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800"
      >
        {/* Sparkles */}
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
            initial={{ 
              scale: 0, 
              opacity: 0,
              rotate: 0 
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              delay: sparkle.delay,
              duration: sparkle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
          >
            <div
              className="text-yellow-300"
              style={{ fontSize: `${sparkle.size}px` }}
            >
              ✨
            </div>
          </motion.div>
        ))}

        {/* Main Text */}
        <motion.div
          className="text-center z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ 
            scale: showText ? 1 : 0.5, 
            opacity: showText ? 1 : 0 
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2
          }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 mb-4 tracking-wider"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(236, 72, 153, 0.5)",
                "0 0 40px rgba(147, 51, 234, 0.8)",
                "0 0 20px rgba(236, 72, 153, 0.5)"
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            SLAY QUEEN
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-purple-200 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: showText ? 1 : 0, 
              y: showText ? 0 : 20 
            }}
            transition={{ 
              duration: 0.6, 
              delay: 0.8 
            }}
          >
            Your wardrobe, your rules ✨
          </motion.p>
        </motion.div>

        {/* Floating sparkles around text */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300 text-xl"
              style={{
                left: `${50 + 35 * Math.cos((i * 45) * Math.PI / 180)}%`,
                top: `${50 + 35 * Math.sin((i * 45) * Math.PI / 180)}%`,
              }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>

        {/* Background sparkle effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`bg-${i}`}
              className="absolute text-purple-400/20 text-base"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ 
                y: [-15, 15, -15],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                repeat: Infinity,
                delay: Math.random() * 1.5,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        {/* Skip button */}
        <motion.button
          className="absolute top-4 right-4 text-purple-200 hover:text-white transition-colors text-sm font-medium"
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip ✨
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeScreen; 