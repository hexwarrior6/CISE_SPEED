// pages/register.tsx
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import formStyles from "../styles/Form.module.scss";
import { CreateUserDto, UserRole } from "@/types/user.types";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const registerData: CreateUserDto = {
      username,
      email,
      password,
      firstName,
      lastName,
      role: UserRole.SUBMITTER, // Default role for new users
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
        // Redirect to login page after successful registration
        router.push("/login");
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', padding: '2rem 0' }}>
        <div className={formStyles.form} style={{ width: '100%', maxWidth: '400px' }}>
          <h1 className="text-center mb-lg">Register</h1>
          <form onSubmit={handleRegister}>
            <div className={formStyles.formGroup}>
              <label htmlFor="username" className={formStyles.formLabel}>
                Username:
              </label>
              <input
                className={formStyles.formControl}
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

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

            <div className={formStyles.formGroup}>
              <label htmlFor="firstName" className={formStyles.formLabel}>
                First Name:
              </label>
              <input
                className={formStyles.formControl}
                type="text"
                name="firstName"
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="lastName" className={formStyles.formLabel}>
                Last Name:
              </label>
              <input
                className={formStyles.formControl}
                type="text"
                name="lastName"
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </div>

            <button
              className={`${formStyles.btnPrimary} ${formStyles.formGroup}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-muted">
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
