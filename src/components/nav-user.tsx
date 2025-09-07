"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserButton, useUser } from "@clerk/nextjs"

export function NavUser() {
  const {user} =useUser()
if(user)
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserButton showName
        appearance={{
          elements:{
            rootBox: ' w-full!',
            userButtonBox: ' w-full! flex-row-reverse!',
            userButtonTrigger: 'w-full p-1'
          }
        }}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
