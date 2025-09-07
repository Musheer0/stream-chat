"use client";

import { useStreamTokenStore } from '@/stores/streamTokenStore';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import { toast } from 'sonner';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useRouter } from 'next/navigation';
import { sendEndSystemMessage } from '@/actions/send-sys-msg';

const VideoCallRoom = ({ id }: { id: string }) => {
  const { user } = useUser();
  const { token } = useStreamTokenStore();
  const [call, setCall] = useState<Call | null>(null);
  const router = useRouter();

  // ✅ memoize client so it’s not recreated on each render
  const client = useMemo(() => {
    if (!user || !token) return null;
    return new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      token,
      user: {
        id: user.id,
        image: user.imageUrl || undefined,
        name: user.fullName || user.id,
      },
    });
  }, [user?.id, user?.imageUrl, user?.fullName, token,user]);

  useEffect(() => {
    if (!client || !id) return;

    const streamCall = client.call("default", id);

    streamCall.join({ create: true })
      .then(() => setCall(streamCall))
      .catch(() => toast.error("Failed to join call"));

    return () => {
      if (streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(() => toast.error("Something went wrong"));
      }
    };
  }, [client, id, router]);

  if (!user) {
    return (
      <div className="flex flex-col flex-1 h-full justify-center items-center">
        Unauthorized
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col flex-1 h-full justify-center items-center">
        Loading client...
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex flex-col flex-1 h-full justify-center items-center">
        Loading call...
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme className='text-white'>
        <StreamCall call={call}>
          <div className="flex flex-col">
            <div className="relative flex-1">
              <SpeakerLayout />
            </div>
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
              <CallControls
                onLeave={async() => {
                    sendEndSystemMessage(id)
                  router.push("/app");
                }}
              />
            </div>
          </div>
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
};

export default VideoCallRoom;
