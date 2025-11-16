// import MattersPage from './pages/MattersPage'
import MattersList from './pages/MattersList';
import HomePage from './pages/HomePage'
import MatterForm from './components/MatterForm';
const routes = [
    {
        path: '/', component:  <HomePage /> 
    },
    {
        path: '/matters', component: <MattersList /> 
    },
    {
        path: '/matter', component: <MatterForm />
    }
]

export default routes;