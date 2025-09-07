import VideoCall from '@/components/video/video-call-room'
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params


  return (
    <VideoCall id={id}/>
  )
}

export default page