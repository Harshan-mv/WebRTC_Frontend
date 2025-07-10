import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useWebRTC from "../hooks/useWebRTC";
import VideoGrid from "../components/VideoGrid";
import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import ChatPanel from "../components/ChatPanel";

function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  const {
    peers,
    userVideo,
    peerStates,
    toggleMute,
    toggleCamera,
    raiseHand,
    localStream,
  } = useWebRTC(roomId, user);

  const [handRaised, setHandRaised] = useState(false);

  // Toggle raise/lower hand
  const handleRaiseHand = () => {
    const newStatus = !handRaised;
    setHandRaised(newStatus);
    raiseHand(newStatus);
  };

  // Leave the room and stop media
  const handleLeave = () => {
    socket.emit("leave-room", { roomId });
    navigate("/"); // redirect after leaving
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4 text-center">Room: {roomId}</h2>

      {/* 🖥️ Video grid */}
      <VideoGrid
        peers={peers}
        userVideo={userVideo}
        peerStates={peerStates}
        currentUser={user}
        localStream={localStream}
      />

      {/* 🎮 Controls */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <button
          onClick={toggleMute}
          className={`px-4 py-2 rounded text-white ${
            peerStates.localMuted ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {peerStates.localMuted ? "🎤 Unmute" : "🔇 Mute"}
        </button>

        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded text-white ${
            peerStates.localCameraOff ? "bg-green-700" : "bg-purple-600"
          }`}
        >
          {peerStates.localCameraOff ? "🎥 Turn Camera On" : "📷 Turn Camera Off"}
        </button>

        <button
          onClick={handleRaiseHand}
          className={`px-4 py-2 rounded ${
            handRaised ? "bg-yellow-500 text-black" : "bg-yellow-300 text-black"
          }`}
        >
          {handRaised ? "🙌 Lower Hand" : "✋ Raise Hand"}
        </button>

        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          🚪 Leave Room
        </button>
      </div>

      {/* 💬 Chat section */}
      <div className="mt-6">
        <ChatPanel roomId={roomId} user={user} />
      </div>
    </div>
  );
}

export default RoomPage;
