import { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import styles from './PopulatedNavBar.module.scss';

const PopulatedNavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const adminDropdownRef = useRef<HTMLLIElement>(null);
  const userDropdownRef = useRef<HTMLLIElement>(null);

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setShowAdminDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navBrand}>
          SPEED
        </Link>
        
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/articles" className={styles.navLink}>
              Articles
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/search" className={styles.navLink}>
              Search
            </Link>
          </li>
          
          {isAuthenticated && (
            <>
              {/* Submitter link for submitters */}
              {(user?.role === 'Submitter' || user?.role === 'Administrator') && (
                <li className={styles.navItem}>
                  <Link href="/submit" className={styles.navLink}>
                    Submit Article
                  </Link>
                </li>
              )}
              
              {/* Moderator link for moderators */}
              {(user?.role === 'Moderator' || user?.role === 'Administrator') && (
                <li className={styles.navItem}>
                  <Link href="/moderator" className={styles.navLink}>
                    Moderate Articles
                  </Link>
                </li>
              )}
              
              {/* Admin menu for administrators */}
              {user?.role === 'Administrator' && (
                <li className={styles.navItem} ref={adminDropdownRef}>
                  <div 
                    className={`${styles.navLink} ${styles.dropdownToggle}`}
                    onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                  >
                    Admin <IoMdArrowDropdown />
                  </div>
                  <div className={`${styles.dropdownMenu} ${showAdminDropdown ? styles.show : ''}`}>
                    <Link href="/admin" className={styles.dropdownItem} onClick={() => setShowAdminDropdown(false)}>
                      Dashboard
                    </Link>
                    <Link href="/admin/users" className={styles.dropdownItem} onClick={() => setShowAdminDropdown(false)}>
                      User Management
                    </Link>
                  </div>
                </li>
              )}
              
              <li className={styles.navItem} ref={userDropdownRef}>
                <div 
                  className={styles.userMenu}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className={styles.userAvatar}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <IoMdArrowDropdown />
                </div>
                <div className={`${styles.dropdownMenu} ${showUserDropdown ? styles.show : ''}`}>
                  <div className={styles.dropdownItem}>
                    {user?.username} ({user?.role})
                  </div>
                  <div 
                    className={styles.dropdownItem} 
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                  >
                    Logout
                  </div>
                </div>
              </li>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <li className={styles.navItem}>
                <Link href="/login" className={styles.navLink}>
                  Login
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/register" className={styles.navLink}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default PopulatedNavBar;
