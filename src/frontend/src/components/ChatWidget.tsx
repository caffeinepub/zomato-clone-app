import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  from: "user" | "support";
  text: string;
}

const CANNED_RESPONSES = [
  "How can I help you today? 😊",
  "Your order is being tracked in real time.",
  "Our support team is available 24/7 for any issues.",
  "You can cancel your order within 2 minutes of placing it.",
  "Refunds are processed within 3-5 business days.",
  "Is there anything else I can help you with?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "support",
      text: "👋 Hi! Welcome to FoodRush Support. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = CANNED_RESPONSES[responseIdx % CANNED_RESPONSES.length];
      setResponseIdx((prev) => prev + 1);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "support", text: reply },
      ]);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }, 1000);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-4 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
          style={{ maxHeight: "400px" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 border-b border-gray-100"
            style={{ background: "linear-gradient(135deg,#1a6b55,#0f4f40)" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
              🍴
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">FoodRush Support</p>
              <p className="text-white/70 text-[10px]">
                Typically replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
              data-ocid="chat.close_button"
            >
              <X size={16} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-3 space-y-2"
            style={{ minHeight: "200px", maxHeight: "280px" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.from === "user"
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              className="flex-1 text-xs bg-gray-50 rounded-full px-3 py-2 outline-none border border-gray-200"
              data-ocid="chat.input"
            />
            <button
              type="button"
              onClick={sendMessage}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: "#16a34a" }}
              data-ocid="chat.submit_button"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-4 rounded-full shadow-lg flex items-center justify-center text-white z-50 transition-transform active:scale-95"
        style={{
          background: "linear-gradient(135deg,#16a34a,#0f4f40)",
          width: 52,
          height: 52,
        }}
        data-ocid="chat.open_modal_button"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold">
            1
          </span>
        )}
      </button>
    </>
  );
}
