
import React from 'react';
import { HashRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';  
import SignIn from '~/components/Login';
import  Home from '~/components/home';

const App = () => {   
    return (
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/popup.html" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
    );  
};  

export default App;