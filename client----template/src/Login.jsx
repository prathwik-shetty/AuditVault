import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let result;

      if (isRegistering) {
        result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>◆ AuditVault</h1>

        <h2>
          {isRegistering ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={
              isRegistering ? "new-password" : "current-password"
            }
          />

          <button type="submit" className="login-button">
            {isRegistering ? "Create Account" : "Login"}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <button
          type="button"
          className="register-button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError("");
          }}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;