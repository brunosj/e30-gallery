'use client'

import type { GalleryPage } from '@/app/payload-types'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { RichText } from '../RichText'
import { motion, useAnimation, useInView, useScroll } from 'motion/react'
import { fadeInVariants, backgroundVariants } from '@/app/_utilities/animationVariants'
import classes from './index.module.css'
import cn from 'classnames'
import { getImageUrl } from '@/app/_utilities/getImageUrl'

type Props = {
  data: GalleryPage
}

export const GalleryVision: React.FC<Props> = ({ data }: Props) => {
  const { main_text, textImageBlock } = data
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
      ref={ref}
      initial="initial"
      animate={controls}
      variants={backgroundVariants}
      className={cn(classes.grid, 'container padding-y')}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className={classes.leftColumn}
      >
        <div className={classes.image}>
          <Image
            src={getImageUrl(textImageBlock.imageVision?.url || '')}
            alt={textImageBlock.imageVision.title}
            fill
          />
        </div>
        <div className={classes.line} />
        <RichText content={textImageBlock.text_under_image} />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInVariants}
        className={classes.info}
      >
        <div className={classes.content}>
          <RichText content={main_text} />
        </div>
      </motion.div>
    </motion.section>
  )
}
