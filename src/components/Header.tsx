function Header() {
  return (
    <header className="header">
      <div>
        <h1>BIM WORLD AGENT</h1>
        <span>Spatial reasoning environment</span>
      </div>

      <div className="status">
        <span className="status-dot" />
        Connected
      </div>
    </header>
  )
}

export default Header