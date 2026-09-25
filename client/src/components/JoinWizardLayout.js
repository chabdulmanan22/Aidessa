import React, { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HeroGridBoxesAnimation from './HeroGridBoxesAnimation';

const STEP_ORDER = {
  '/join-notice': 0,
  '/join-details': 1,
  '/join-contact': 2,
  '/join-loss': 3,
  '/join-thanks': 4,
  '/join-submitted': 5,
};

const shuffleVariants = {
  enter: (direction) => ({
    x: direction >= 0 ? 80 : -80,
    rotate: direction >= 0 ? 2 : -2,
    scale: 0.97,
    opacity: 0,
  }),
  center: {
    x: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction) => ({
    x: direction >= 0 ? -80 : 80,
    rotate: direction >= 0 ? -2 : 2,
    scale: 0.97,
    opacity: 0,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const JoinWizardLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const prevPathRef = useRef(location.pathname);

  let direction = 1;
  const prevOrder = STEP_ORDER[prevPathRef.current] ?? 0;
  const currOrder = STEP_ORDER[location.pathname] ?? 0;
  if (prevPathRef.current !== location.pathname) {
    direction = currOrder >= prevOrder ? 1 : -1;
    prevPathRef.current = location.pathname;
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-start sm:justify-center items-center pt-8 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-[#F8E7C9]">
      {/* Persistent Animated Grid Background across all wizard steps */}
      <HeroGridBoxesAnimation />

      {/* Main card container with card shuffle animation */}
      <div className="relative z-10 w-full max-w-3xl mx-auto my-auto pt-2 sm:pt-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={shuffleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JoinWizardLayout;
