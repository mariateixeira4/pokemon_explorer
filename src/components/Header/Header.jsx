import { NavLink } from "react-router-dom";
import "./Header.css";

function Header({ onGoHome }) {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__logo">Pokémon Explorer</h1>

        <p className="header__subtitle">
          O teu próximo Pokémon está à tua espera!
        </p>

        <nav className="header__nav" aria-label="Navegação principal">
          <NavLink
            to="/"
            end
            onClick={onGoHome}
            className={({ isActive }) =>
              `header__nav-button ${
                isActive ? "header__nav-button--active" : ""
              }`
            }
          >
            Página inicial
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `header__nav-button ${
                isActive ? "header__nav-button--active" : ""
              }`
            }
          >
            Meus Pokémon favoritos
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
