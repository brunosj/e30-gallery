type Props = {
  url: string
}

export const IFrameComponent = ({ url }: Props) => {
  return (
    <div>
      <iframe
        src={url}
        className="w-full"
        allowfullscreen="allowfullscreen"
        style={{ minWidth: '100%', minHeight: '100%' }}
      />
    </div>
  )
}
