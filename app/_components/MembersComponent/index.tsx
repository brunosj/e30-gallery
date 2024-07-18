'use client'

import type { MembersOnlyPage } from '@/app/payload-types'

import React, { useState } from 'react'
import { MembersHome } from '../MembersHome'
import { MembersArtAdvice } from '../MembersArtAdvice'
import { MembersSpecialEvents } from '../MembersSpecialEvents'
import { MembersVirtualExhibition } from '../MembersVirtualExhibition'
import { Button } from '@/components/Button'
import Image from 'next/image'
import { RichText } from '../RichText'

import classes from './index.module.css'

type Props = {
  data: MembersOnlyPage
}

const MembersAreaComponent: React.FC<Props> = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState<string>('home')
  const {
    tab_title_home,
    tab_title_virtual_exhibition,
    tab_title_special_events,
    tab_title_art_advice,
  } = data
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <MembersHome data={data} />
      case 'virtualExhibition':
        return <MembersVirtualExhibition data={data} />
      case 'specialEvents':
        return <MembersSpecialEvents data={data} />
      case 'individualArtAdvice':
        return <MembersArtAdvice data={data} />
      default:
        return <MembersHome data={data} />
    }
  }

  return (
    <article className={classes.account}>
      <nav className={classes.nav}>
        <li className={classes.buttonContainer}>
          <button
            onClick={() => setActiveTab('home')}
            className={activeTab === 'home' ? classes.active : 'controls'}
          >
            {tab_title_home}
          </button>
        </li>
        <li className={classes.buttonContainer}>
          <button
            onClick={() => setActiveTab('virtualExhibition')}
            className={activeTab === 'virtualExhibition' ? classes.active : 'controls'}
          >
            {tab_title_virtual_exhibition}
          </button>
        </li>
        <li className={classes.buttonContainer}>
          <button
            onClick={() => setActiveTab('specialEvents')}
            className={activeTab === 'specialEvents' ? classes.active : 'controls'}
          >
            {tab_title_special_events}
          </button>
        </li>
        <li className={classes.buttonContainer}>
          <button
            onClick={() => setActiveTab('individualArtAdvice')}
            className={activeTab === 'individualArtAdvice' ? classes.active : 'controls'}
          >
            {tab_title_art_advice}
          </button>
        </li>
      </nav>
      <section className={classes.content}>
        <div>{renderContent()}</div>
      </section>
    </article>
  )
}

export default MembersAreaComponent
