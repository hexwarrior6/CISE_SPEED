import { IoMdArrowDropdown } from "react-icons/io";
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";

const PopulatedNavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <NavBar>
      <NavItem>SPEED</NavItem>
      <NavItem route="/" end>
        Home
      </NavItem>
      <NavItem dropdown route="/articles">
        Articles <IoMdArrowDropdown />
        <NavDropdown>
          <NavItem route="/articles">View articles</NavItem>
          <NavItem route="/articles/new">Submit new</NavItem>
        </NavDropdown>
      </NavItem>
      {isAuthenticated ? (
        <>
          <NavItem dropdown>
            {user?.username} ({user?.role}) <IoMdArrowDropdown />
            <NavDropdown>
              <NavItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </NavItem>
            </NavDropdown>
          </NavItem>
        </>
      ) : (
        <>
          <NavItem route="/login">Login</NavItem>
          <NavItem route="/register">Register</NavItem>
        </>
      )}
    </NavBar>
  );
};

export default PopulatedNavBar;
