import { Link, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Tag, Edit3, List } from 'react-feather';

export default function Header() {
  const { pathname } = useLocation();
  const navItem = (to: string, label: string, icon: React.ReactNode) => {
    const active = pathname === to || (to !== '/' && pathname.startsWith(to));
    return (
      <Link
        to={to}
        aria-label={label}
        className={`p-2 rounded-md flex items-center justify-center transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100 ${
          active ? 'bg-gray-100 text-gray-900' : ''
        }`}
      >
        {icon}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-b bg-white/90 backdrop-blur-sm z-[9999]">
      <Link to="/" className="flex items-center gap-2">
        <img src="/icons/dotdotdot.png" alt="dotdotdot" className="h-8 w-auto" />
        <span className="sr-only">Memo</span>
      </Link>

      <nav className="flex items-center gap-2">
  {navItem('/', 'Notes', <Edit3 size={20} />)}
  {navItem('/notes', 'List', <List size={20} />)}
        {navItem('/timetable', 'Timetable', <Clock size={20} />)}
        {navItem('/calendar', 'Calendar', <CalendarIcon size={20} />)}
        <button aria-label="Tags" disabled className="p-2 rounded-md text-gray-400 opacity-50 cursor-not-allowed">
          <Tag size={20} />
        </button>
      </nav>
    </header>
  );
}