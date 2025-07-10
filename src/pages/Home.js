// src/pages/Home.js
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton"; 

function Home() {
  const { user } = useAuth();
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome {user.name}</h1>
          <img src={user.picture} alt="profile" />
          <a href="/create" className="text-blue-500">Create Room</a> | 
          <a href="/join" className="text-green-500">Join Room</a>
          <a href="/lobby" className="text-green-500">Public Lobby</a>


        </div>
      ) : (
        <GoogleLoginButton />
      )}
    </div>
  );
}

export default Home;
