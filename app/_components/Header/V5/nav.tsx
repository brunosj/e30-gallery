import * as React from 'react'
import { motion } from 'framer-motion'
import { MenuItems } from './items'
import classes from './index.module.css'

export const Navigation = () => (
  <ul className={classes.menu}>
    <MenuItems />
  </ul>
)
