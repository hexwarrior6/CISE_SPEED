// pages/login.tsx
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import formStyles from "../styles/Form.module.scss";
import { LoginUserDto } from "../types/user.types";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form className={formStyles.form} onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          className={formStyles.formItem}
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          className={formStyles.formItem}
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button className={formStyles.formItem} type="submit">
          Login
        </button>
      </form>

      <p>
        Don&#39;t have an account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
