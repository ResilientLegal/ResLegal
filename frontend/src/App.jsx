import NavSideBar from './components/NavSideBar'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import routes from './route'

function App() {
  return (
    <>
      <NavSideBar />
      <Routes>
        {routes.map((route) => <Route
            path={route.path}
            element={route.component}
        />)}
      </Routes>
    </>
  )
}

export default App
