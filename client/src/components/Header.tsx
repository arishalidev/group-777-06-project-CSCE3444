import { Link, useLocation } from 'react-router';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-[#00853E] rounded flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-xl font-semibold text-gray-800">NavSense</span>
        </Link>

        <nav className="flex gap-8">
          <Link
            to="/"
            className={`text-sm transition-colors ${
              isActive('/') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`text-sm transition-colors ${
              isActive('/search') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Search
          </Link>
          <Link
            to="/navigator"
            className={`text-sm transition-colors ${
              isActive('/navigator') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Navigator
          </Link>
        </nav>
      </div>
    </header>
  );
}