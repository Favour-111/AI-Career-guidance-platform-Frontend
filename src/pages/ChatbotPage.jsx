import React, { useState } from "react";
import ChatbotSection from "../components/chatbot/ChatbotSection";
import InterviewPrepSection from "../components/chatbot/InterviewPrepSection";

const ChatbotPage = () => {
  const [activeTab, setActiveTab] = useState("chatbot");

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 md:px-0 min-h-[80vh]">
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 text-xs py-2 rounded-t-lg font-semibold transition-colors duration-200 focus:outline-none ${
            activeTab === "chatbot"
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setActiveTab("chatbot")}
        >
          AI Chatbot
        </button>
        <button
          className={`px-6 text-xs py-2 rounded-t-lg font-semibold transition-colors duration-200 focus:outline-none ml-2 ${
            activeTab === "interview"
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => setActiveTab("interview")}
        >
          Interview Preparation
        </button>
      </div>
      <div className="bg-white dark:bg-dark-card rounded-b-lg shadow-lg p-4 min-h-[60vh]">
        {activeTab === "chatbot" ? <ChatbotSection /> : <InterviewPrepSection />}
      </div>
    </div>
  );
};

export default ChatbotPage;
