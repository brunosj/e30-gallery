'use client'

import { Link } from '@/i18n/navigation'
import Insta from '@/components/SVG/Insta'
import Maps from '@/components/SVG/Maps'
import { motion, Variants } from 'motion/react'
import classes from './index.module.css'
import { normalizeExternalUrl } from '@/app/_utilities/normalizeExternalUrl'
import { useSocials } from '@/providers/Socials'

const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
}

export const Socials: React.FC = () => {
  const socials = useSocials()

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Insta color="var(--color-black)" size={20} />
      case 'Google Maps':
        return <Maps color="var(--color-black)" size={22} />
      default:
        return null
    }
  }

  if (!socials?.socials?.length) {
    return null
  }

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInVariants}
      className={classes.socials}
    >
      {socials.socials.map((item, index) => (
        <li key={index}>
          <a
            href={normalizeExternalUrl(item.url || '')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.platform}
          >
            {renderSocialIcon(item.platform)}
          </a>
        </li>
      ))}
      <li className="desktop">
        <p>Egenolffstr. 30 Frankfurt</p>
      </li>
    </motion.ul>
  )
}
