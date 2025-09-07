import { NextRequest, NextResponse } from "next/server";
import * as wh from '@clerk/nextjs/webhooks'
import { StreamChat } from "stream-chat"

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
)
export const POST = async (req:NextRequest)=>{
    try {
        const {type,data} =await wh.verifyWebhook(req,{signingSecret:process.env.CLERK_WH})
    
    if(!(type==='user.created'||type==='user.updated'))
    return NextResponse.json({success:false,error:'un-authorized webhook'},{status:400})
    const user_agent = req.headers.get('user-agent')
    const {id,first_name,last_name,image_url,phone_numbers,email_addresses,primary_phone_number_id,primary_email_address_id} = data
    const new_user = {
        id,
        name:first_name+" "+last_name||'',
        image:image_url,
        email_address: email_addresses.find((e)=>e.id===primary_email_address_id)?.email_address||null,
        phone_number:phone_numbers.find((e)=>e.id===primary_phone_number_id)?.phone_number||null,
        user_agent,
        ip:req.headers.get('ip')
    }
    try {
        if(serverClient && (new_user.email_address||new_user.phone_number)){
        await serverClient.upsertUser(new_user)
    }
    } catch (error) {
    console.error('[stream sdk error]',error)   
    return NextResponse.json({success:false,error})
    }
    return NextResponse.json(
    { success: true },
    { status: type === "user.created" ? 201 : 200 }
    )

    } catch (error) {
          console.error('[clerk webhook sdk error]',error)   
    return NextResponse.json({success:false,error})
    }
}