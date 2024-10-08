import React from 'react'
import type { MembersOnlyPage } from '@/app/payload-types'
import classes from './index.module.css'

type Props = {
  data: MembersOnlyPage
}

export const MembersVirtualExhibition: React.FC<Props> = ({ data }: Props) => {
  const { page_title_virtual_exhibition, virtualExhibition } = data

  return (
    <section>
      <div className="container padding-t">
        <h3 className="membersAreaTitle mobile">{page_title_virtual_exhibition}</h3>
      </div>
      <div dangerouslySetInnerHTML={{ __html: virtualExhibition || '' }} />
    </section>
  )
}
