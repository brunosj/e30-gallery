import * as m from '@/paraglide/messages.js'

export const ExhibitionLink = (label = m.exhibitions(), appearance = 'default') => ({
  url: '/exhibitions',
  label,
  appearance,
})

export const ArtistLink = (label = m.artists(), appearance = 'default') => ({
  url: '/artists',
  label,
  appearance,
})

export const ArtSocietyLink = (label = m.clickHere(), appearance = 'default') => ({
  url: '/art-society',
  label,
  appearance,
})

export const HomeLink = (label = m.clickHere(), appearance = 'default') => ({
  url: '/',
  label,
  appearance,
})

export const LogOutLink = (label = m.logout(), appearance = 'secondary') => ({
  url: '/logout',
  label,
  appearance,
})

export const LogInLink = (label = m.login(), appearance = 'secondary') => ({
  url: '/art-society',
  label,
  appearance,
})
