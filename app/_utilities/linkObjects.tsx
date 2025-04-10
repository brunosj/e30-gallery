// Don't import useTranslations directly at the top level
// import { useTranslations } from 'next-intl'

// Define types for all link objects
export type LinkObject = {
  url: string
  label: string
  appearance: string
}

// Direct link objects for use in components
export const ExhibitionLink = (label = 'Exhibitions', appearance = 'default'): LinkObject => ({
  url: '/exhibitions',
  label,
  appearance,
})

export const ArtistLink = (label = 'Artists', appearance = 'default'): LinkObject => ({
  url: '/artists',
  label,
  appearance,
})

export const ArtSocietyLink = (label = 'Art Society', appearance = 'default'): LinkObject => ({
  url: '/art-society',
  label,
  appearance,
})

export const HomeLink = (label = 'Home', appearance = 'default'): LinkObject => ({
  url: '/',
  label,
  appearance,
})

export const LogOutLink = (label = 'Log Out', appearance = 'secondary'): LinkObject => ({
  url: '/logout',
  label,
  appearance,
})

export const LogInLink = (label = 'Log In', appearance = 'secondary'): LinkObject => ({
  url: '/art-society',
  label,
  appearance,
})

// Keep the create* functions for backward compatibility
export const createExhibitionLink = ExhibitionLink
export const createArtistLink = ArtistLink
export const createArtSocietyLink = ArtSocietyLink
export const createHomeLink = HomeLink
export const createLogOutLink = LogOutLink
export const createLogInLink = LogInLink
