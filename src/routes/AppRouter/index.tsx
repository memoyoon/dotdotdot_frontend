import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateGate from '../PrivateGate';
import NotePage from '../../pages/NotePage';
import NotesListPage from '../../pages/NotesListPage';
import TimetablePage from '../../pages/TimeTablePage';
import CalendarPage from '../../pages/CalendarPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateGate />,
    children: [
  { index: true, element: <NotePage /> },
  { path: 'notes', element: <NotesListPage /> },
      { path: 'timetable', element: <TimetablePage /> },
      { path: 'calendar', element: <CalendarPage /> },
    ],
  },
  { path: '*', element: <div className="p-6">Not Found</div> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}