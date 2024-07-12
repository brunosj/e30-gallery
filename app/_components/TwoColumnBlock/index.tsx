import type { TwoColumnBlock } from '@/app/payload-types'

import Image from 'next/image'
import RichText from '../RichText'

const TwoColumnBlockComponent: React.FC<{ block: TwoColumnBlock[] }> = ({ block }) => {
  const { invertOrder, columnText, columnImage } = block[0]

  function getSizePercentage(size: string) {
    switch (size) {
      case 'oneThird':
        return 'w-[33%]'
      case 'half':
        return 'w-[50%]'
      case 'twoThirds':
        return 'w-[66%]'
      case 'full':
        return 'w-full'
      default:
        return 'w-full'
    }
  }

  const textColumnWidth = getSizePercentage(columnText.size || 'full')
  const imageColumnWidth = getSizePercentage(columnImage.size || 'full')
  const image =
    typeof columnImage.image === 'string' ? columnImage.image : columnImage.image.url || ''

  return (
    <div className={`w-full flex ${invertOrder ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
      <div className={`${textColumnWidth} p-4`}>
        {columnText.title && <h2>{columnText.title}</h2>}
        <p>{columnText.subtitle}</p>
        {columnText.content && (
          <div>
            <RichText content={columnText.content} />
          </div>
        )}
        {columnText.addLink && columnText.link && (
          <a href={columnText.link.url || '#'} target={columnText.link.newTab ? '_blank' : '_self'}>
            {columnText.link.label}
          </a>
        )}
      </div>
      <div className={`${imageColumnWidth} w-full p-4 relative`}>
        <Image src={image} alt="" fill className="object-cover" />
      </div>
    </div>
  )
}

export default TwoColumnBlockComponent
