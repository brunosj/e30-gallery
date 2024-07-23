import type { Testimonial } from '@/app/payload-types'

import Image from 'next/image'
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
        {/* <div className={classes.avatar}>
          <Image src={item.picture.url} alt={item.picture.title} fill />
        </div> */}
        <div className={classes.info}>
          <h3 className="desktop">{`"${item.testimonial}"`}</h3>
          <h4 className="mobile">{`"${item.testimonial}"`}</h4>
          <p className="semibold">{item.name}</p>
        </div>
      </div>
    </div>
  )
}
