import { Link, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Tag, Edit3 } from 'react-feather';

export default function Header() {
  const { pathname } = useLocation();
  const navItem = (to: string, label: string, icon: React.ReactNode) => {
    const active = pathname === to || (to !== '/' && pathname.startsWith(to));
    return (
      <Link
        to={to}
        aria-label={label}
        className={`p-2 rounded-md flex items-center justify-center transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800 ${
          active ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' : ''
        }`}
      >
        {icon}
      </Link>
    );
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm">
      <Link to="/" className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
        Memo
      </Link>

      <nav className="flex items-center gap-2">
        {navItem('/', 'Notes', <Edit3 size={20} />)}
        {navItem('/timetable', 'Timetable', <Clock size={20} />)}
        {navItem('/calendar', 'Calendar', <CalendarIcon size={20} />)}
        <button aria-label="Tags" disabled className="p-2 rounded-md text-gray-400 opacity-50 cursor-not-allowed">
          <Tag size={20} />
        </button>
      </nav>
    </header>
  );
}