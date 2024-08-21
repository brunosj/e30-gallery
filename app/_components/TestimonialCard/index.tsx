import type { Testimonial } from '@/app/payload-types'

import classes from './index.module.css'
import Star from '@/components/SVG/Stars'

export const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.stars}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} color="var(--color-yellow)" size={30} />
          ))}
        </div>
        <div className={classes.info}>
          <p>{`"${item.testimonial}"`}</p>
          <p className="semibold">{item.name}</p>
        </div>
      </div>
    </div>
  )
}
