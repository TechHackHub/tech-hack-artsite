"use client";

import React from "react";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const TransitionPage: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionPage;
