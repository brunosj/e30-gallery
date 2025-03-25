'use client'

import type { ReachOut } from '@/app/payload-types'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView, useScroll } from 'framer-motion'
import { fadeInVariants, backgroundVariants } from '@/app/_utilities/animationVariants'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import Chevron from '@/components/SVG/Chevron'
import classes from './index.module.css'
import cn from 'classnames'

type Props = {
  data: ReachOut
}

export default function BannerReachOutComponentV2({ data }: Props) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, {
    amount: 0.5,
  })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(scrollYProgress.get())
    }

    const unsubscribe = scrollYProgress.onChange(handleScroll)

    return () => {
      unsubscribe()
    }
  }, [scrollYProgress])

  useEffect(() => {
    if (inView) {
      if (scrollY <= 0.25) {
        controls.start('enter')
      } else if (scrollY <= 0.75) {
        controls.start('middle')
      } else {
        controls.start('end')
      }
    }
  }, [scrollY, inView, controls])

  useEffect(() => {
    if (!inView && scrollY >= 0.25) {
      controls.start('initial')
    }
  }, [inView, scrollY, controls])

  return (
    <motion.section
      className={classes.bg}
      ref={ref}
      initial="initial"
      animate={controls}
      variants={backgroundVariants}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.75 }}
        variants={fadeInVariants}
        className={cn(classes.reachOut, 'container', 'padding-y-sm')}
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
    </motion.section>
  )
}
