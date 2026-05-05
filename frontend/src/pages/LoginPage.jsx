import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const lowerUser = username.toLowerCase();

    const volunteerUsers = [
      "benji",
      "tashi",
      "kushal",
    ];

    if (volunteerUsers.includes(lowerUser)) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          username:
            lowerUser.charAt(0).toUpperCase() +
            lowerUser.slice(1),
          role: "volunteer",
        })
      );

      navigate("/");
    } else if (lowerUser === "rahool") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: "Rahool",
          role: "coordinator",
        })
      );

      navigate("/");
    } else {
      alert("Invalid username");
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "300px",
          padding: "30px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          CreekWatch Login
        </h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
          }}
        >
          Test Users:
          <br />
          Benji = Volunteer
          <br />
          Tashi = Volunteer
          <br />
          Kushal = Volunteer
          <br />
          Rahool = Coordinator
        </p>
      </form>
    </div>
  );
}

export default LoginPage;