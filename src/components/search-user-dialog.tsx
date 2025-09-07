/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StreamChat, } from "stream-chat";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useChatContext } from "stream-chat-react";

interface User {
  id: string;
  name: string;
  image?: string;
}

interface SearchChatDialogProps {
  client: StreamChat; // Stream client from useCreateChatClient
  currentUserId: string;
  children?: ReactNode; // custom trigger button or element
}

const SearchChatDialog: React.FC<SearchChatDialogProps> = ({ client, currentUserId, children }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const {setActiveChannel} = useChatContext()
  // Search users
  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) return setResults([]);

    setLoading(true);
    try {
      const { users } = await client.queryUsers(
        { name: { $autocomplete: query } }, 
      );

      // Filter out current user and map needed fields
      const filteredUsers = users
        .filter(u => u.id !== currentUserId)
        .map(u => ({
          id: u.id,
          name: u.name || "Unknown",
          image: (u.image as string) || undefined,
        }));

      setResults(filteredUsers);
    } catch (err) {
      console.error("Error searching users:", err);
    }
    setLoading(false);
  };

  // Select user
  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch("");
    setResults([]);
  };

  // Remove user
  const removeUser = (id: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== id));
  };

  // Create chat
  const createChat = async () => {
    if (selectedUsers.length === 0) return;

    const memberIds = [currentUserId, ...selectedUsers.map(u => u.id)];

    // Determine channel name
    let channelName = "";
    if (selectedUsers.length === 1) {
      channelName = selectedUsers[0].name; // single chat
    } else {
      // group chat, limit to first 5 names for long groups
      const names = selectedUsers.map(u => u.name);
      channelName = names.length > 5 ? names.slice(0, 5).join(", ") + "..." : names.join(", ");
    }

    const channel = client.channel("messaging", undefined, {
      members: memberIds,
      name: channelName,
    } as any);

    await channel.create();
    setActiveChannel(channel)
    setSelectedUsers([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button>Create Chat</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {loading && <p>Searching...</p>}

          {results.length > 0 && (
            <div className="border rounded-md p-2 space-y-1 max-h-40 overflow-y-auto">
              {results.map(user => (
                <div
                  key={user.id}
                  className="p-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 rounded"
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar>
                    <AvatarImage src={user.image} />
                  </Avatar>
                  {user.name}
                </div>
              ))}
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(user => (
                <div key={user.id} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full">
                  <span>{user.name}</span>
                  <button onClick={() => removeUser(user.id)} className="text-red-500 font-bold">×</button>
                </div>
              ))}
            </div>
          )}

        <DialogClose asChild>
            <Button
            onClick={createChat}
            disabled={selectedUsers.length === 0}
          >
            Create Chat
          </Button>
        </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchChatDialog;
