import MattersList from './pages/MattersList';
import HomePage from './pages/HomePage';
import MatterForm from './components/MatterForm';
import NewMatterForm from './components/NewMatterForm';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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
        path: '/matter/:id', component: <ProtectedRoute><MatterForm /></ProtectedRoute>
    },
    {
        path: '/matter/-1', component: <ProtectedRoute><NewMatterForm /></ProtectedRoute>
    }
]

export default routes;