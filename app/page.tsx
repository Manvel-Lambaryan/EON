export function HomePage() {
  const navItems = ['Home', 'About', 'Gallery', 'Books', 'Contact', 'Journal'];

  return (
    <main className="container">
      <header className="cosmic-header">
        <a href="/" className="brand">
          EON
        </a>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="nav-link">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </main>
  );
}

export default HomePage;
