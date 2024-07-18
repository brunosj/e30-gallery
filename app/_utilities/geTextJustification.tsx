export const getTextJustificationClass = (justification: string) => {
  switch (justification) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-left'
  }
}
