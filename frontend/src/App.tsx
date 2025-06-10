import React from 'react'
import { BrowserRouter as Router , Route , Routes } from 'react-router-dom';
import Home from "./pages/Home";
import PrivacyPolicy from './pages/PrivacyPolicy';
import Term from './pages/Term';





const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
        <Route path="/term" element={<Term/>}/>
      </Routes>
    </Router>
  )
}

export default App