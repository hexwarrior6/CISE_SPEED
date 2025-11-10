// pages/register.tsx
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import formStyles from "../styles/Form.module.scss";
import { CreateUserDto, UserRole } from "../types/user.types";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // All users register as Submitter by default
    const registerData: CreateUserDto = {
      username,
      email,
      password,
      role: UserRole.SUBMITTER, // Always register as Submitter
      firstName,
      lastName,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      if (response.ok) {
        alert("Registration successful! You can now login.");
        router.push("/login");
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form className={formStyles.form} onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

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

        <label htmlFor="firstName">First Name:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="firstName"
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />

        <button className={formStyles.formItem} type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
