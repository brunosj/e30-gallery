import * as React from 'react'
import { motion } from 'framer-motion'
import classes from './index.module.css'

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="var(--color-white)"
    strokeLinecap="round"
    {...props}
  />
)

export const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <div className={classes.hamburgerContainer}>
    <motion.button
      onClick={toggle}
      className={classes.hamburger}
      initial={{ backgroundColor: 'transparent' }}
      animate={{ backgroundColor: 'var(--color-accent)' }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 23 23">
        <Path
          variants={{
            closed: {
              d: 'M 2 2.5 L 20 2.5',
              stroke: 'var(--color-white)',
            },
            open: {
              d: 'M 3 16.5 L 17 2.5',
              stroke: 'var(--color-accent)',
            },
          }}
          transition={{ duration: 0.5 }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1, stroke: 'var(--color-white)' },
            open: { opacity: 0, stroke: 'var(--color-black)' },
          }}
          transition={{ duration: 0.5 }}
        />
        <Path
          variants={{
            closed: {
              d: 'M 2 16.346 L 20 16.346',
              stroke: 'var(--color-white)',
            },
            open: {
              d: 'M 3 2.5 L 17 16.346',
              stroke: 'var(--color-accent)',
            },
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </motion.button>
  </div>
)
