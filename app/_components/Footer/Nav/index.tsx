'use client'

import type { Footer } from '@/app/payload-types'

import React from 'react'
import { Button } from '@/components/Button'
import { RichText } from '@/components/RichText'
import { LinkObject } from '@/app/types'
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
          <div className={classes.scaledContainer}>
            <div className={classes.text}>
              <RichText content={call_to_action} />
            </div>
          </div>
        </div>

        {/* Navigation columns */}
        {nav &&
          nav.map((category, index) => (
            <div className={classes.column} key={index}>
              <div className={classes.scaledContainer}>
                <h4>{category.category}</h4>
                <ul>
                  {category.navItem &&
                    category.navItem.map((item, idx) => (
                      <li key={idx}>
                        <Button link={item.link as LinkObject} />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
