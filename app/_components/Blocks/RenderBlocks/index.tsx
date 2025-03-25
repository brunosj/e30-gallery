import React from 'react'
import type {
  TwoColumnBlock,
  CallToAction,
  MediaBlock,
  TextBlock,
  VideoBlock,
} from '@/app/payload-types'
import { components } from '@/components/Blocks'
import cn from 'classnames'

// need to list all possible block types here

interface TwoColumnBlockProps extends TwoColumnBlock {
  blockType: 'two-column-block'
}

interface CallToActionBlockProps extends CallToAction {
  blockType: 'cta'
}

interface MediaBlockProps extends MediaBlock {
  blockType: 'mediaBlock'
}

interface TextBlockProps extends TextBlock {
  blockType: 'textBlock'
}

interface VideoBlockProps extends VideoBlock {
  blockType: 'videoBlock'
}

export type Layout =
  | TwoColumnBlockProps
  | CallToActionBlockProps
  | MediaBlockProps
  | TextBlockProps
  | VideoBlockProps

type Props = {
  layout: Layout[]
  className?: string
}

const RenderBlocks: React.FC<Props> = ({ layout, className }) => (
  <div className={cn(className)}>
    {layout.map((block, i) => {
      const Block: React.FC<any> = components[block.blockType]
      if (Block) {
        return (
          <section key={i}>
            <Block {...block} />
          </section>
        )
      }

      return null
    })}
  </div>
)

export default RenderBlocks
