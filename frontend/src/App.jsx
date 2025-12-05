import { useLocation } from 'react-router-dom';
import NavSideBar from './components/NavSideBar';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import routes from './route';

function App() {
  const location = useLocation();
  
  // Hide sidebar on login and signup pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {!hideNavbar && <NavSideBar />}
      <main className="app-main">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
