import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore(); // Default to empty array

  const capitalizeName = (name = "") => {
    return name.replace(/\b\w/g, char => char.toUpperCase());
  };

  if (!selectedUser) return null; // don't render header if no user is selected

  const isOnline = Array.isArray(onlineUsers) && selectedUser?._id && onlineUsers.includes(selectedUser._id);

  return (
    <div className="
      p-2 border-b border-base-200 bg-gradient-to-r from-indigo-950 via-white to-rose-500
      shadow-md rounded-t-xl
    ">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="size-12 md:size-14 object-cover rounded-full border-2 border-white shadow-lg"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white" />
            )}
          </div>

          {/* Name & Status */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-rose-200 text-base md:text-lg truncate">
              {capitalizeName(selectedUser.fullName)}
            </h3>
            <p className={`text-xs md:text-sm font-medium ${isOnline ? "text-green-600" : "text-zinc-400"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-rose-100 transition-all duration-200 text-zinc-500 hover:text-rose-600"
        >
          <X className="size-7 cursor-pointer md:size-6 font-mono text-indigo-800" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
