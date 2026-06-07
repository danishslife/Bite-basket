import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("show_mobile_menu", menuOpen);
    return () => document.body.classList.remove("show_mobile_menu");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const goToSection = (sectionId: string) => {
    closeMenu();
    navigate("/");
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/");
  };

  return (
    <header>
      <nav className="navbar section_content">
        <Link to="/" className="nav_logo" onClick={closeMenu}>
          <h2 className="logo_text">🍲 BiteBasket</h2>
        </Link>

        <ul className="nav_menu">
          <button
            id="menu_close_button"
            className="fas fa-times"
            onClick={closeMenu}
            aria-label="Close menu"
          ></button>

          <li className="nav_items">
            <Link to="/" className="nav_link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav_items">
            <a
              href="/#recipes"
              className="nav_link"
              onClick={(e) => {
                e.preventDefault();
                goToSection("recipes");
              }}
            >
              Recipes
            </a>
          </li>
          <li className="nav_items">
            <a
              href="/#about"
              className="nav_link"
              onClick={(e) => {
                e.preventDefault();
                goToSection("about");
              }}
            >
              About
            </a>
          </li>

          {user ? (
            <>
              <li className="nav_items">
                <Link to="/profile" className="nav_link" onClick={closeMenu}>
                  Profile
                </Link>
              </li>
              <li className="nav_items">
                <button className="nav_link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav_items">
                <Link to="/login" className="nav_link" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="nav_items">
                <Link to="/register" className="nav_link" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          id="menu_open_button"
          className="fas fa-bars"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        ></button>
      </nav>
    </header>
  );
};
