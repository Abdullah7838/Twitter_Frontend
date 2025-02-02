import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile';
import Comments from './components/Comments';
import Account from './components/Account';
import Navbar from './components/Navbar';
import Admin from './Admin/Admin';
import NotFound from './components/NotFound';

// This is a functional wrapper component to conditionally render the Navbar
function NavbarWrapper({ logout }) {
  const location = useLocation();

  // List of routes where Navbar should NOT be shown
  const noNavbarRoutes = ['/login', '/signup', '/'];

  // If the current route is in the noNavbarRoutes array, don't render Navbar
  if (noNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  // Otherwise, render Navbar
  return <Navbar logout={logout} />;
}

class App extends Component {
  constructor(props) {
    super(props);

    const savedEmail = localStorage.getItem('email');

    this.state = {
      email: savedEmail || null,
      isLogin: !!savedEmail, 
    };
  }

  // Updates both login state and email together
  setLogin = (email) => {
    localStorage.setItem('email', email);
    this.setState({ email, isLogin: true });
  };

  logout = () => {
    localStorage.removeItem('email');
    this.setState({ email: null, isLogin: false });
  };

  render() {
    return (
      <Router>
        {/* Conditional Navbar rendering */}
        <NavbarWrapper logout={this.logout} />

        <Routes>
          <Route path="/login" element={<Login setLogin={this.setLogin} />} />
          <Route path="/signup" element={<Signup setLogin={this.setLogin} />} />
          <Route
            path="/home"
            element={<Main email={this.state.email} isLogin={this.state.isLogin} logout={this.logout} />}
          />
          <Route path="/profile" element={<Profile email={this.state.email} logout={this.logout} isLogin={this.state.isLogin}/>} />
          <Route path="/comments/:id" element={<Comments email={this.state.email} />} />
          <Route path="/account/:email" element={<Account logout={this.logout} myemail={this.state.email} Uemail={this.state.email}/>} />
          <Route path="/admin" element={<Admin email={this.state.email} />} />
          <Route path="/not-found" element={<NotFound />} />

          <Route path="/" element={<Home email={this.state.email} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
