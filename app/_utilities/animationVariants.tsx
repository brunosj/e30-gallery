import { Variants } from 'framer-motion'

export const textVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const clipPathVariants = {
  hidden: {
    transform: 'translate3d(0, 30%, 0)',
    clipPath: 'polygon(0% -100%, 100% -100%, 100% 0%, 0% 0%)',
    transition: {
      transform: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1] },
      clipPath: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  },
  visible: {
    transform: 'translate3d(0, 0, 0)',
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: {
      transform: { duration: 0.9, ease: [0.215, 0.61, 0.355, 1] },
      clipPath: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  },
}

export const cardVariants = (index: number) => ({
  hidden: {
    opacity: 0,
    y: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: index * 0.2,
    },
  },
})

export const cascadeVariants = (index: number) => ({
  hidden: {
    opacity: 0,
    y: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: index * 0.05,
    },
  },
})

export const fadeInVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: 'easeOut',
    },
  },
}

export const slideInFromLeftVariants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const slideInFromRightVariants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const gradientVariants: Variants = {
  initial: {
    background: 'linear-gradient(180deg, black 0%, var(--color-accent) 100%)',
  },
  start: {
    background: 'linear-gradient(180deg, black 0%, var(--color-accent) 100%)',
  },
  mid: {
    background: 'linear-gradient(180deg, black 0%, var(--color-accent) 100%)',
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
  end: {
    background: 'linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
}

export const backgroundVariants = {
  initial: {
    backgroundColor: 'var(--color-black)',
    transition: {
      duration: 0,
    },
  },
  enter: {
    backgroundColor: 'var(--color-accent)',
    transition: {
      backgroundColor: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  },
  middle: {
    backgroundColor: 'var(--color-accent)',
    transition: {
      backgroundColor: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  },
  end: {
    backgroundColor: 'var(--color-accent)',
    transition: {
      backgroundColor: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  },
}
