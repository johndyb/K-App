import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Login} from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';


export const Routes = () => {
  return(
        <Router>

            <Switch>

              <Routes path="/">
                <Login />
              </Routes>

              <Routes path="/Register">
                <Register />
              </Routes>

              <Routes path="/Home">
                <Home />
              </Routes>

              <Routes path="/Dashboard">
                <Dashboard />
              </Routes>

            </Switch>
    </Router>
  )
}