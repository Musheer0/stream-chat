import { auth } from "@clerk/nextjs/server";
import {NextResponse } from "next/server";
import { StreamChat } from "stream-chat"
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
)
export const GET = async()=>{
    try {
        const session = await auth()
        if(!session.userId)
            return NextResponse.json({success:false,error:'Unauthorized'},{status:401})
        const rate_limit_key = `rate-limit:${session.userId}`
        const count = await redis.incr(rate_limit_key);
         if (count === 1) {
        await redis.expire(rate_limit_key, 60);
        }
        if (count > 5) {
        return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
            );
            }
        const token = serverClient.createToken(session.userId)
        return NextResponse.json({success:true,token,exp:55 * 60 * 1000})
    } catch (error) {
        console.log('[stream sdk error]',error)
        return NextResponse.json({success:false,error:'Internal server error'},{status:500})
    }
}