'use client'

import type { ReachOut } from '@/app/payload-types'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView, useScroll } from 'framer-motion'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/Button'
import Chevron from '@/components/SVG/Chevron'
import classes from './index.module.css'
import { fadeInVariants } from '@/app/_utilities/animationVariants'

type Props = {
  data: ReachOut
}

const backgroundVariants = {
  initial: {
    backgroundImage: 'linear-gradient(180deg, var(--color-black) 0%, var(--color-black) 100%)',
    transition: {
      duration: 0,
    },
  },
  enter: {
    backgroundImage: 'linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent) 100%)',
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
      backgroundImage: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  },
  middle: {
    backgroundImage: 'linear-gradient(180deg, black 0%, var(--color-accent) 100%)',
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
      backgroundImage: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  },
  end: {
    backgroundImage: 'linear-gradient(180deg, var(--color-black) 0%, var(--color-black) 100%)',
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
      backgroundImage: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  },
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
    if (!inView) {
      controls.start('initial')
    }
  }, [inView, controls])

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
    </motion.section>
  )
}
