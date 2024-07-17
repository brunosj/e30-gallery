import type { MembersOnlyPage } from '@/app/payload-types'

import Image from 'next/image'
import { RichText } from '../RichText'

import classes from './index.module.css'

type Props = {
  data: MembersOnlyPage
}

export const MembersHome: React.FC<Props> = ({ data }: Props) => {
  const {} = data
  return <section className="container"></section>
}
