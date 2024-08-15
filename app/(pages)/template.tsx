'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
    // initial={{ y: 300, opacity: 1 }}
    // animate={{ y: 0, opacity: 1 }}
    // exit={{ y: 300, opacity: 1 }}
    // transition={{
    //   type: 'spring',
    //   stiffness: 260,
    //   damping: 20,
    //   duration: 5,
    // }}
    >
      {children}
    </motion.div>
  )
}
