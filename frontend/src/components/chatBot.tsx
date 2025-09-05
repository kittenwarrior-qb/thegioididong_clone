import logo4 from '../assets/tgdd/logo4.png'
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
const socketUrl = import.meta.env.VITE_SOCKET_URL;

const socket = io(socketUrl, { withCredentials: true });

interface Message {
  user: "user" | "admin";
  text: string;
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("chat_messages");
    if (stored) setMessages(JSON.parse(stored));

    socket.on("load_messages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => {
        if (
          prev.length === 0 ||
          prev[prev.length - 1].user !== msg.user ||
          prev[prev.length - 1].text !== msg.text
        ) {
          return [...prev, msg];
        }
        return prev;
      });
    });

    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send_message", { text: input });
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {open ? (
        <div className="w-[450px] h-[700px] bg-white shadow-lg rounded-xl flex flex-col overflow-hidden">
          <div className="bg-[#4D4D4D] px-4 py-2 flex justify-between items-center rounded-t-xl">
            <div className='bg-white p-2 rounded-full'><img src={logo4} width={20} height={20} /></div>
            <span className="font-semibold text-[18px] text-white">Thế giới di động</span>
            <button onClick={() => setOpen(false)} className="text-gray-700 font-bold">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.user === "user" ? "justify-end" : "justify-start"
                } items-start`}
              >
                {msg.user === "admin" && (
                  <div className='bg-white p-2 rounded-full mt-1'><img src={logo4} width={16} height={16} /></div>
                )}
                <div
                  className={`p-2 rounded-lg max-w-[70%] break-words ${
                    msg.user === "user"
                      ? "bg-[#4D4D4D] text-white"
                      : "bg-[#F3F4F6] text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-gray-200 flex gap-2 items-center">
            <button className="p-2 rounded hover:bg-gray-200 ">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none border-gray-200"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={sendMessage}
              className="p-2 rounded-full bg-[#ffd500] hover:bg-yellow-400 text-[12px]"
            >
              Gửi
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#ffd500] p-3 rounded-full shadow-lg"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBot;
