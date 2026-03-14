import { Link } from 'react-router-dom';
import '../styles/Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>📝 Todo App</h1>
        </Link>
      </div>
    </header>
  );
};
