/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Channel, ChannelHeader, MessageInput, MessageList, useChatContext, Window } from 'stream-chat-react'
import { Button } from './ui/button'
import { VideoIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { sendSystemMessage } from '@/actions/send-sys-msg'
import { Event } from 'stream-chat'
import { toast } from 'sonner'

const ChatRoom = () => {
    const router = useRouter()
    const {user} = useUser()
    const [calling ,setIsCalling] = useState(false)
    const {channel} = useChatContext()
    const handleCall = async()=>{
      if(channel){
        setIsCalling(true)
        try {
            await sendSystemMessage(channel.id!)
                        router.push(`/call/${channel?.id}`)
        } 
        finally{
            setIsCalling(false)
        }
      }
    }
    const handleNewMsg = (c:Event)=>{
        if (c.message) {
    if (c.message.type === "system" ) {
        if(c.message.user?.id===user?.id){
            return;
        }
      if (c.message.html) {
        if (c.message.html.includes(channel?.id!)) {
          toast.custom((t) => (
            <div className="p-4 bg-background rounded-lg shadow-md space-y-3">
              <p className="font-semibold">{c.message?.user?.name} is  calling</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.dismiss(t) // close toast
                    router.push(`/call/${channel?.id}`) // redirect without reload
                  }}
                >
                  Join
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    toast.dismiss(t) // just dismiss
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ), { duration: 30000 }) // 30s timeout
        }
      }
    }
  }
    }

    useEffect(()=>{
        channel?.on("message.new",handleNewMsg)
        return ()=>{
            channel?.off("message.new",handleNewMsg)
        }
    },[channel])
  return (
    <section className='flex flex-col w-full flex-1'>
        {channel ?
    <Channel>
           <Window>
            <div className='flex sticky top-0 z-10 bg-background items-center justify-between w-full'>
                {channel.data?.member_count===1 ? (
                    <ChannelHeader title='everyone has left this chat'/>
                ):(
                    <ChannelHeader/>
                )}
                <Button
                disabled={calling}
                onClick={handleCall}
                >
                    <VideoIcon/>
                    {calling ? 'calling':'call'}
                </Button>
            </div>
            <MessageList/>
            <div className="sticky bottom-0 w-full">
                <MessageInput/>
            </div>
            </Window>
    </Channel>   
    :
    <div className='flex flex-col items-center justify-center h-full '>
        <h2 className='text-2xl font-semibold text-muted-foreground mb-4'>
            No chat selected
        </h2>
        <p className='text-muted-foreground'>
            Select a chat from the sidebar or start a new conversation
        </p>
    </div>
    }
    </section>
  )
}

export default ChatRoom