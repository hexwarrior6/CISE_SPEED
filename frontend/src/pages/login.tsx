// pages/login.tsx
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import formStyles from "../styles/Form.module.scss";
import { LoginUserDto } from "@/types/user.types";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const loginData: LoginUserDto = {
      email,
      password,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Store the token and user info in localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard or home page
        router.push("/");
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', padding: '2rem 0' }}>
        <div className={formStyles.form} style={{ width: '100%', maxWidth: '400px' }}>
          <h1 className="text-center mb-lg">Login</h1>
          <form onSubmit={handleLogin}>
            <div className={formStyles.formGroup}>
              <label htmlFor="email" className={formStyles.formLabel}>
                Email:
              </label>
              <input
                className={formStyles.formControl}
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="password" className={formStyles.formLabel}>
                Password:
              </label>
              <input
                className={formStyles.formControl}
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <button 
              className={`${formStyles.btnPrimary} ${formStyles.formGroup}`} 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-muted">
            Don&#39;t have an account? <Link href="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
