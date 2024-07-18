import React from 'react'
import type { MembersOnlyPage } from '@/app/payload-types'
import classes from './index.module.css'

type Props = {
  data: MembersOnlyPage
}

export const MembersVirtualExhibition: React.FC<Props> = ({ data }: Props) => {
  const { virtualExhibition, tab_title_virtual_exhibition } = data

  return (
    <section>
      <div
        className={classes.iframeContainer}
        dangerouslySetInnerHTML={{ __html: virtualExhibition }}
      />
    </section>
  )
}
