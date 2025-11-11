import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  sender: "customer" | "staff"
  content: string
  timestamp: string
  senderName: string
  senderRole: string
}

export default function MessageBubble({ message }: { message: Message }) {
  const isCustomer = message.sender === "customer"

  return (
    <div className={`flex gap-3 ${isCustomer ? "justify-end" : "justify-start"}`}>
      {!isCustomer && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Minh" />
          <AvatarFallback>MN</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col gap-1 max-w-xs ${isCustomer ? "items-end" : "items-start"}`}>
        {!isCustomer && <p className="text-xs font-semibold text-muted-foreground">{message.senderName}</p>}
        <div
          className={`px-4 py-2 rounded-lg break-words ${
            isCustomer
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted text-foreground rounded-bl-none"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground">{message.timestamp}</p>
      </div>
    </div>
  )
}
