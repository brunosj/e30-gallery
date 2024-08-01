import React from 'react'
import type { TwoColumnBlock, CallToAction } from '@/app/payload-types'
import { components } from '@/components/Blocks'

// need to list all possible block types here

interface TwoColumnBlockProps extends TwoColumnBlock {
  blockType: 'two-column-block'
}

interface CallToActionBlockProps extends CallToAction {
  blockType: 'cta'
}

export type Layout = TwoColumnBlockProps | CallToActionBlockProps

type Props = {
  layout: Layout[]
  className?: string
}

const RenderBlocks: React.FC<Props> = ({ layout, className }) => (
  <div className={[className].filter(Boolean).join(' ')}>
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
