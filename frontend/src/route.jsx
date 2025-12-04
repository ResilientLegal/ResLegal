import MattersList from './pages/MattersList';
import HomePage from './pages/HomePage'
import MatterForm from './components/MatterForm';

const routes = [
    {
        path: '/', component: <HomePage />
    },
    {
        path: '/matters', component: <MattersList />
    },
    {
        path: '/matter/:id', component: <MatterForm />
    }
]

export default routes;