function Header({ activePage, onNavigate }) {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__logo">Pokémon Explorer</h1>

        <p className="header__subtitle">
          O teu próximo Pokémon está à tua espera!
        </p>

        <nav className="header__nav" aria-label="Navegação principal">
          <button
            type="button"
            className={`header__nav-button ${
              activePage === "home" ? "header__nav-button--active" : ""
            }`}
            onClick={() => onNavigate("home")}
            aria-current={activePage === "home" ? "page" : undefined}
          >
            Página inicial
          </button>

          <button
            type="button"
            className={`header__nav-button ${
              activePage === "favorites" ? "header__nav-button--active" : ""
            }`}
            onClick={() => onNavigate("favorites")}
            aria-current={activePage === "favorites" ? "page" : undefined}
          >
            Meus Pokémon favoritos
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
