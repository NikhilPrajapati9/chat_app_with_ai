import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isOwn?: boolean;
  email: string;
  timestamp?: string;
  className?: string;
}

const ChatBubble = ({
  message,
  isOwn = false,
  email,
  timestamp,
  className,
}: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[75%] mb-2",
        isOwn ? "items-end self-end" : "items-start self-start"
      )}
    >
      <small className="text-xs mx-1 opacity-60 ">{email}</small>
      <div
        className={cn(
          "px-4 py-2 rounded-xl mx-1 break-words overflow-auto shadow-sm",

          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none",
          className
        )}
      >
        {message}
      </div>
      {timestamp && (
        <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
      )}
    </div>
  );
};

export default ChatBubble;
