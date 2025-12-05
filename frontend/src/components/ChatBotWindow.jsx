import React, { useState, useRef, useEffect } from "react";
import { TbFilePlus } from "react-icons/tb";
import "../styles/ChatBotWindow.css";
// Assuming LangchainClient.js functions can handle file context
import { askBot, summarizePdf } from "../services/LangchainClient"; 

export default function ChatBotWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  // Keep track of the *context* associated with the last uploaded PDF
  const [pdfContext, setPdfContext] = useState(null); 
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      // **FIX/IMPROVEMENT:** Pass the current PDF context (if any) to askBot.
      // The askBot function in LangchainClient must be updated to handle this context.
      const msg = await askBot(userMessage.text, pdfContext);
      
      const botmsg = { sender: "bot", text: msg };
      setMessages(prev => [...prev, botmsg]);
    } catch (e) {
      console.error(e); // Use console.error for errors
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, I had trouble responding." }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    // Clear the file input value so the same file can be uploaded again
    e.target.value = null; 
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    // Reset context before new upload
    setPdfContext(null); 

    // 1. Show that user uploaded a file
    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        fileName: file.name,
        fileType: "pdf"
      }
    ]);

    // 2. Show "summarizing..." message
    setMessages(prev => [
      ...prev,
      { sender: "bot", text: `Reading and summarizing "${file.name}"...` }
    ]);
    setIsThinking(true);

    try {
      // **CRITICAL CHANGE:** `summarizePdf` should *not only* return the summary 
      // but also the **context/session ID/reference** that `askBot` needs.
      // I'm assuming `summary` is an object: `{ text: "...", contextRef: "..." }`
      const result = await summarizePdf(file);
      
      // Update state with the summary text
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: result.text || result } // Assuming it returns a text string or an object
      ]);
      
      // **IMPROVEMENT:** Store the reference needed for subsequent questions
      setPdfContext(result.contextRef || file.name); // Using file.name as fallback context
      
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't process or summarize that PDF. Please try again." }
      ]);
    } finally {
      setIsThinking(false);
    }

    console.log("PDF file selected:", file.name);
  };

  return (
    // ... (rest of the component is unchanged)
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
        💬
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>AI Assistant</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {/* Render the message text first */}
                {msg.text && msg.text}

                {/* Render file details for user messages related to uploads */}
                {msg.fileType === "pdf" && (
                  <div className="uploaded-file">
                    📄 **{msg.fileName}** successfully uploaded.
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="chat-message bot thinking-indicator">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            <button
              className="upload-icon"
              onClick={() => document.getElementById("pdf-upload").click()}
              title="Upload PDF to chat"
            >
              <TbFilePlus size={22} />
            </button>

            <input
              type="text"
              placeholder={pdfContext ? "Ask about the uploaded document..." : "Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              // Disable input while the bot is thinking/processing
              disabled={isThinking}
            />

            <button 
              onClick={sendMessage} 
              className="send-btn"
              disabled={isThinking || !input.trim()} // Disable send button when thinking or input is empty
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}