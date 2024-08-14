'use client'

import type { Footer } from '@/app/payload-types'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { RichText } from '@/components/RichText'
import { textVariants, clipPathVariants } from '@/utilities/animationVariants'
import { motion } from 'framer-motion'

import classes from './index.module.css'

type Props = {
  data: Footer
}

export const FooterNav: React.FC<Props> = ({ data }: Props) => {
  const { nav, call_to_action } = data

  return (
    <div className="container padding-y">
      <div className={classes.footer}>
        {/* Call to Action column */}
        <div className={classes.textColumn}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
            variants={clipPathVariants}
            className={classes.scaledContainer}
          >
            <div className={classes.text}>
              <RichText content={call_to_action} />
            </div>
          </motion.div>
        </div>

        {/* Navigation columns */}
        {nav &&
          nav.map((category, index) => (
            <div className={classes.column} key={index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={clipPathVariants}
                className={classes.scaledContainer}
              >
                <h4>{category.category}</h4>
                <ul>
                  {category.navItem &&
                    category.navItem.map((item, idx) => (
                      <li key={idx}>
                        <Button link={item.link} />
                      </li>
                    ))}
                </ul>
              </motion.div>
            </div>
          ))}
      </div>
    </div>
  )
}
