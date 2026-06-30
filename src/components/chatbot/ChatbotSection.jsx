import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../common/Spinner";
import api from "../../services/api";
import { fetchProfile } from "../../store/slices/profileSlice";

const DEFAULT_GREETING = {
  role: "assistant",
  content: "Hi! I’m your AI Career Assistant. Ask me anything about your career, tech stack, or professional growth!",
};

const buildGreeting = (profile) => {
  if (profile?.targetCareer) {
    return {
      role: "assistant",
      content: `Hi! I already know you’re working toward ${profile.targetCareer}. Ask me about skills, certifications, interview prep, salary expectations, or market trends for that path.`,
    };
  }

  return DEFAULT_GREETING;
};

const ChatbotSection = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const chatEndRef = useRef(null);
  const greeting = useMemo(() => buildGreeting(profile), [profile]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const { data } = await api.get("/chatbot/history");
        const history = Array.isArray(data?.messages)
          ? data.messages
              .filter((msg) => msg && typeof msg.content === "string" && msg.content.trim())
              .map((msg) => ({ role: msg.role, content: msg.content }))
          : [];

        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([greeting]);
        }
      } catch (err) {
        setMessages([greeting]);
        setNotice("Could not load previous chat history. Starting a new session.");
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [greeting]);

  useEffect(() => {
    if (messages.length === 1 && messages[0]?.role === "assistant" && messages[0]?.content === DEFAULT_GREETING.content) {
      setMessages([greeting]);
    }
  }, [greeting, messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearHistory = async () => {
    setError(null);
    setNotice(null);
    try {
      await api.delete("/chatbot/history");
      setMessages([greeting]);
      setNotice("Chat history cleared.");
    } catch (err) {
      const apiMessage = err.response?.data?.error || err.message;
      setError(apiMessage ? `Unable to clear history: ${apiMessage}` : "Unable to clear history.");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const { data } = await api.post("/chatbot", {
        message: input,
        context: {
          targetCareer: profile?.targetCareer || "",
          fieldOfStudy: profile?.fieldOfStudy || "",
          location: profile?.location || "",
          interests: profile?.interests || [],
          skills: profile?.skills || [],
        },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.warning) {
        setNotice(data.warning);
      }
    } catch (err) {
      const apiMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message;

      const message =
        err.response?.status === 401
          ? "Please sign in again to use the chatbot."
          : err.response?.status === 403
            ? "You do not have permission to use this chatbot."
            : apiMessage
              ? `Something went wrong: ${apiMessage}`
              : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex items-center justify-between gap-3 px-2">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-300">
          {historyLoading ? "Loading saved chat..." : "Your chat is saved to your account."}
        </p>
        <button
          type="button"
          className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={clearHistory}
          disabled={loading || historyLoading}
        >
          Clear History
        </button>
      </div>
      <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
        {profile?.targetCareer
          ? `Personalized for ${profile.targetCareer}${profile.fieldOfStudy ? ` · ${profile.fieldOfStudy}` : ""}`
          : "General guidance mode. Complete your profile to personalize every answer."}
      </div>
      <div className="flex-1 overflow-y-auto mb-4 px-2">
        {historyLoading ? (
          <div className="h-full min-h-[320px] flex items-center justify-center">
            <div className="text-center">
              <Spinner size="md" />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">Fetching your saved chats...</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] shadow transition-all duration-200 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none animate-chat-user"
                    : "bg-gray-100 dark:bg-dark-bg text-gray-800 dark:text-gray-200 rounded-bl-none animate-chat-bot"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      {notice && <div className="text-amber-600 text-xs mb-2">{notice}</div>}
      {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-bg dark:text-white transition"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || historyLoading}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60 transition inline-flex items-center justify-center gap-2 min-w-[92px]"
          disabled={loading || historyLoading || !input.trim()}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span>Sending</span>
            </>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatbotSection;
