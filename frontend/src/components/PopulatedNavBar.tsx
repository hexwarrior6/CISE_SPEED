import { IoMdArrowDropdown } from "react-icons/io";
import { useAuth } from '../contexts/AuthContext';
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
      <NavItem route="/articles">
        Articles
      </NavItem>
      <NavItem route="/search">
        Search
      </NavItem>
      {isAuthenticated && (
        <>
          {/* Submitter link for submitters */}
          {(user?.role === 'Submitter' || user?.role === 'Administrator') && (
            <NavItem route="/submit">
              Submit Article
            </NavItem>
          )}
          
          {/* Moderator link for moderators */}
          {(user?.role === 'Moderator' || user?.role === 'Administrator') && (
            <NavItem route="/moderator">
              Moderate Articles
            </NavItem>
          )}
          
          {/* Admin menu for administrators */}
          {user?.role === 'Administrator' && (
            <NavItem dropdown route="/admin">
              Admin <IoMdArrowDropdown />
              <NavDropdown>
                <NavItem route="/admin">Dashboard</NavItem>
                <NavItem route="/admin/users">User Management</NavItem>
              </NavDropdown>
            </NavItem>
          )}
          
          <NavItem dropdown>
            {user?.username} ({user?.role}) <IoMdArrowDropdown />
            <NavDropdown>
              <NavItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </NavItem>
            </NavDropdown>
          </NavItem>
        </>
      )}
      {!isAuthenticated && (
        <>
          <NavItem route="/login">Login</NavItem>
          <NavItem route="/register">Register</NavItem>
        </>
      )}
    </NavBar>
  );
};

export default PopulatedNavBar;
