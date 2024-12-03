import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Websocket() {
  const [message, setMessage] = useState([]); // Initialize as an array
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [data, setData] = useState("");
  const [socket, setSocket] = useState(null); // Use state to store WebSocket instance
  const name = useSelector((state) => state.name.name);
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!name) {
      navigate("/");
    }
    const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      if (receivedData.type === "message") {
        console.log(true);

        setMessage((prev) => [...prev, receivedData]);
      } else if (receivedData.type === "onlineCount") {
        setOnlineUsers(receivedData.count);
      }
      console.log("Received:", receivedData);
      console.log(message);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws); // Save the WebSocket instance to state

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setData(e.target.value);
  };

  // Send message to the server
  const sendMessage = (e) => {
    e.preventDefault();
    if (data.trim() !== "" && socket && socket.readyState === WebSocket.OPEN) {
      const sendMsgObject = { type: "message", client: name, text: data };
      socket.send(JSON.stringify(sendMsgObject));
      setMessage((prev) => [
        ...prev,
        { type: "message", client: "You", text: data },
      ]);
      setData(""); // Clear input after sending
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen bg-slate-900 p-4 relative">
      <span className="bg-slate-200 p-2 absolute top-0 left-0 rounded-full rounded-tl-none shadow">Online: <span className="text-green-700 font-bold">
      {onlineUsers}</span></span>
      <div className="md:min-w-[40%] min-w-full max-w-[50%] h-[70%]">
        <div className="mt-2 h-full p-3 overflow-y-auto no-scrollbar rounded-md flex flex-col-reverse bg-slate-600">
          <ul className="w-full flex flex-col">
            {message.map((msg, index) => (
              <li
                key={index}
                className={
                  msg.client === "You"
                    ? "p-2 bg-slate-50 rounded-b-lg rounded-tl-lg mb-2 self-end max-w-72 flex flex-col shadow-md"
                    : "p-2 bg-slate-800 text-white rounded-b-lg rounded-tr-lg mb-2 max-w-72 self-start flex flex-col shadow-md"
                }
              >
                <span
                  className={
                    msg.client === "You"
                      ? "text-blue-600 text-[12px]"
                      : "text-[12px] text-green-500"
                  }
                >
                  {msg.client}
                </span>
                <p>{msg.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={sendMessage} className="flex gap-4 mt-2">
          <input
            type="text"
            value={data}
            onChange={handleChange}
            placeholder="Type a message"
            className="outline-none shadow-md rounded-md p-2 w-full"
          />
          <button
            type="submit"
            className="bg-slate-700 px-3 rounded-md text-white text-2xl shadow"
          >
            ➤ 
          </button>
        </form>
      </div>
    </div>
  );
}

export default Websocket;
