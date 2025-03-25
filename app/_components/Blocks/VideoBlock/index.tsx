import React from 'react'
import { VideoBlock as VideoBlockType } from '@/app/payload-types'
import classes from './index.module.css'
import cn from 'classnames'

const VideoBlock: React.FC<VideoBlockType> = ({ videoType, videoId, title, description }) => {
  // Clean the videoId in case a full URL was provided
  const cleanVideoId = videoId
    .replace(/^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*$/, '$1')
    .replace(/^.*(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+).*$/, '$1')

  // Generate the embed URL based on the video type
  const embedUrl =
    videoType === 'youtube'
      ? `https://www.youtube.com/embed/${cleanVideoId}?rel=0&showinfo=0`
      : `https://player.vimeo.com/video/${cleanVideoId}?dnt=1`

  return (
    <div className={classes.container}>
      {title && <h2 className={classes.title}>{title}</h2>}
      <div className={cn(classes.videoWrapper, classes.aspectVideo)}>
        <iframe
          className={classes.iframe}
          src={embedUrl}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      {description && <p className={classes.description}>{description}</p>}
    </div>
  )
}

export default VideoBlock
