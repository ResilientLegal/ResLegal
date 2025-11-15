// import MattersPage from './pages/MattersPage'
import MattersList from './pages/MattersList';
import HomePage from './pages/HomePage'

const routes = [
    {
        path: '/', component:  <HomePage /> 
    },
    {
        path: '/matters', component: <MattersList /> 
    }
]

export default routes;