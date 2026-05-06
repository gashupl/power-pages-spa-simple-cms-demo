import './TopBar.css';

const TopBar = () => (
  <header className="top-bar">
    <h1 className="top-bar-title">Simple CMS</h1>
    <div className="top-bar-actions">
      <button type="button">Register</button>
      <button type="button">Login</button>
      <button type="button">Logout</button>
    </div>
  </header>
);

export default TopBar;
