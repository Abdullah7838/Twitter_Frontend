import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile';
class App extends Component {
  constructor(props) {
    super(props);
    
    const savedEmail = localStorage.getItem('email');
    const savedLogin = savedEmail ? true : false; 

    this.state = {
      isLogin: savedLogin, 
      email: savedEmail || null, 
    };
  }

  setLogin = (isLogin) => {
    this.setState({ isLogin });
  };

  setEmail = (email) => {
    this.setState({ email });
    
    localStorage.setItem('email', email);
  };

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login setLogin={this.setLogin} setEmail={this.setEmail} />} />
          <Route path="/signup" element={<Signup setLogin={this.setLogin} setEmail={this.setEmail} />} />
          <Route path="/home" element={<Main email={this.state.email} />} />
          <Route path="/profile" element={<Profile email={this.state.email} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
