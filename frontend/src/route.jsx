// import MattersPage from './pages/MattersPage'
import MattersList from './pages/MattersList';
import HomePage from './pages/HomePage'
import MatterForm from './components/MatterForm';
import NewMatterForm from './components/NewMatterForm';

const routes = [
    {
        path: '/', component:  <HomePage /> 
    },
    {
        path: '/matters', component: <MattersList /> 
    },
    {
        path: '/matter/:id', component: <MatterForm />
    },
    {
        path: '/matter/-1', component: <NewMatterForm />
    }
]

export default routes;