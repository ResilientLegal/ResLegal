import MattersList from './pages/MattersList';
import HomePage from './pages/HomePage';
import MatterFormPage from './pages/MatterFormPage';
import NewMatterForm from './components/NewMatterForm';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CalendarPage from './pages/CalendarPage';
import ProtectedRoute from './components/ProtectedRoute';

const routes = [
    {
        path: '/login', component: <LoginPage />
    },
    {
        path: '/signup', component: <SignupPage />
    },
    {
        path: '/', component: <ProtectedRoute><HomePage /></ProtectedRoute>
    },
    {
        path: '/matters', component: <ProtectedRoute><MattersList /></ProtectedRoute>
    },
    {
        path: '/calendar', component: <ProtectedRoute><CalendarPage /></ProtectedRoute>
    },
    {
        path: '/matter/:id', component: <ProtectedRoute><MatterFormPage /></ProtectedRoute>
    },
    {
        path: '/matter/-1', component: <ProtectedRoute><NewMatterForm /></ProtectedRoute>
    }
]

export default routes;
