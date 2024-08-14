'use client'

import type { ReachOut } from '@/app/payload-types'
import { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import Chevron from '@/components/SVG/Chevron'
import { fadeInVariants, gradientVariants } from '@/app/_utilities/animationVariants'
import classes from './index.module.css'

type Props = {
  data: ReachOut
}
export default function BannerReachOutComponen({ data }: Props) {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, {
    amount: 0.5,
  })

  useEffect(() => {
    if (inView) {
      controls.start('end')
    } else {
      controls.start('start')
    }
  }, [inView, controls])

  return (
    <section className={classes.bg}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.75 }}
        variants={fadeInVariants}
        className={[classes.reachOut, 'container', 'padding-y-sm'].filter(Boolean).join(' ')}
      >
        <div className={classes.title}>
          <Chevron color="var(--color-white)" size={25} className="iconTopLeft" />
          <div className={classes.title}>
            <div className="spacedTitle">
              {data.title.split(' ').map((word, index) => (
                <span className={classes.titleElements} key={index}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <Chevron color="var(--color-white)" size={25} className="iconBottomRight" />
        </div>
        <div className={classes.content}>
          <div className={classes.text}>
            <RichText content={data.text} />
          </div>
          <Button link={data.link} />
        </div>
      </motion.div>
    </section>
  )
}
