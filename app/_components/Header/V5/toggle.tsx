import * as React from 'react'
import { motion } from 'framer-motion'
import classes from './index.module.css'

export const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <motion.div
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -50, opacity: 0 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
    className={classes.hamburgerContainer}
  >
    <button onClick={toggle} className={classes.hamburger}>
      <svg viewBox="0 0 23 23" width="23" height="23" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 2 2.5 L 20 2.5"
          fill="transparent"
          stroke="var(--color-white)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M 2 9.423 L 20 9.423"
          fill="transparent"
          stroke="var(--color-white)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M 2 16.346 L 20 16.346"
          fill="transparent"
          stroke="var(--color-white)"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </motion.div>
)
