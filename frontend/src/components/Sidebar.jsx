import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)


  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users



  const capitalizeName = (name) => {
    return typeof name === 'string' ? name.replace(/\b\w/g, char => char.toUpperCase()) : '';
  };

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-screen w-20 sm:w-24 md:w-28 lg:w-72 bg-base-100 shadow-xl rounded-r-3xl flex flex-col border-r border-base-300 overflow-hidden">
      <div className='border-b border-base-300 w-full p-5'>
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-rose-600 via-pink-300 to-indigo-600 shadow-inner rounded-b-3xl">
          <Users className="size-6 text-white" />
          <span className="hidden lg:block font-semibold text-white text-lg">Contacts</span>
        </div>
        <div className='mt-3 hidden lg:flex items-center gap-2'> 
          <label className='cursor-pointer flex items-center gap-2' >
            <input type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className='checkbox checkbox-sm' />
            <span className='text-sm'>Show online only</span>
          </label>
          <span className='text-xs text-zine-500'>({onlineUsers.length -1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${selectedUser?._id === user._id ? 'bg-rose-100 shadow-lg ring-2 ring-rose-300 scale-[1.02]' : 'hover:bg-rose-50 hover:shadow-md'}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.name}
                  className="size-10 md:size-12 object-cover rounded-full border-2 border-white shadow-md"
                />
                {Array.isArray(onlineUsers) && onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              <div className="hidden lg:flex flex-col text-left min-w-0">
                <div className="font-semibold text-zinc-600 truncate font-mono">
                  {capitalizeName(user.fullName)}
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  {Array.isArray(onlineUsers) && onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </div>
              </div>
            </button>
          ))
        ) : (
          <p className="text-center text-zinc-400 py-4">No online users</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
