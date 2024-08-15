import * as React from 'react'
import { motion } from 'framer-motion'
import { MenuItems } from './items'
import classes from './index.module.css'

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

export const Navigation = () => (
  <motion.ul variants={variants} className={classes.menu}>
    <MenuItems />
  </motion.ul>
)
