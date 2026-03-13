import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const ThunderEffect = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleThunder = () => {
      setActive(true);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2405/2405-preview.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
      
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      setTimeout(() => setActive(false), 600);
    };

    window.addEventListener('thunder-add-to-cart', handleThunder);
    return () => window.removeEventListener('thunder-add-to-cart', handleThunder);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Flash Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.2, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.3, 0.5, 1] }}
            className="fixed inset-0 z-[9999] pointer-events-none bg-white"
          />
          
          {/* Screen Shake Effect */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            animate={{ 
              x: [0, -10, 10, -10, 10, 0],
              y: [0, 5, -5, 5, -5, 0]
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[-1] pointer-events-none"
          />
        </>
      )}
    </AnimatePresence>
  );
};
