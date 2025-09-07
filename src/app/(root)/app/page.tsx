/* eslint-disable  @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useStreamTokenStore } from '@/stores/streamTokenStore';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import {
  Chat,
  ChannelList,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ChannelSort } from 'stream-chat';
import ChatSidebarEmptyState from '@/components/chat-sidebar-empty-state';
import ChatRoom from '@/components/chat-room';
import { IconCirclePlusFilled } from '@tabler/icons-react';
import SearchChatDialog from '@/components/search-user-dialog';

const Page = () => {
  const { token } = useStreamTokenStore();
  const { user } = useUser();

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: token,
    userData:  { id: user?.id! },
  });
const filters = { members: { $in: [user?.id||''] }, type: "messaging" };
const options = { presence: true, state: true };

const sort:ChannelSort = { last_message_at: -1 };

if (!user || !client) return <div>Loading...</div>;

  return (
    <Chat client={client}>
          <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" >
         <SearchChatDialog
         client={client}
         currentUserId={user.id}
         >
           <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Create New Chat</span>
            </SidebarMenuButton>
         </SearchChatDialog>
        <ChannelList 
        
        EmptyStateIndicator={ChatSidebarEmptyState}
        filters={filters}
        options={options}
        sort={sort}
        />
      </AppSidebar>
      <SidebarInset>
        <SiteHeader />
        <ChatRoom/>
      </SidebarInset>
    </SidebarProvider>
    </Chat>
  );
};

export default Page;
