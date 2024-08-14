import type {
  Homepage,
  ArtistsPage,
  ArtSocietyPage,
  ExhibitionsPage,
  GalleryPage,
  MembersOnlyPage,
  GenericPage,
  NewsletterPage,
} from '@/app/payload-types'

export type LinkObject = {
  type?: ('reference' | 'custom' | 'mailto') | null
  newTab?: boolean | null
  reference?:
    | ({
        relationTo: 'homepage'
        value: string | Homepage
      } | null)
    | ({
        relationTo: 'artists-page'
        value: string | ArtistsPage
      } | null)
    | ({
        relationTo: 'art-society-page'
        value: string | ArtSocietyPage
      } | null)
    | ({
        relationTo: 'exhibitions-page'
        value: string | ExhibitionsPage
      } | null)
    | ({
        relationTo: 'gallery-page'
        value: string | GalleryPage
      } | null)
    | ({
        relationTo: 'members-only-page'
        value: string | MembersOnlyPage
      } | null)
    | ({
        relationTo: 'generic-pages'
        value: string | GenericPage
      } | null)
    | ({
        relationTo: 'newsletter-page'
        value: string | NewsletterPage
      } | null)
  url?: string | null
  email?: string | null
  subject?: string | null
  body?: string | null
  label: string
  appearance?: ('default' | 'primary' | 'secondary') | null
}
