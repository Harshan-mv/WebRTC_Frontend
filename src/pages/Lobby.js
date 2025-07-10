import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const socket = useSocket();
  const [publicRooms, setPublicRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on("public-rooms", (rooms) => {
      setPublicRooms(rooms);
    });

    socket.emit("get-public-rooms"); // Optionally request list

    return () => socket.off("public-rooms");
  }, [socket]);

  const handleJoin = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🔓 Public Rooms Lobby</h2>

      {publicRooms.length === 0 ? (
        <p className="text-gray-600">No public rooms available.</p>
      ) : (
        <ul className="space-y-4">
          {publicRooms.map((room) => (
            <li
              key={room.roomId}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <p>
                <strong>Room ID:</strong> {room.roomId}
              </p>
              <p>
                <strong>Host:</strong> {room.host}
              </p>
              <p>
                <strong>Users:</strong> {room.users}
              </p>
              <button
                onClick={() => handleJoin(room.roomId)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                🔗 Join Room
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Lobby;
