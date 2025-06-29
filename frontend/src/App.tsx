import { BrowserRouter as Router , Route , Routes } from 'react-router-dom';
import Home from "./pages/Home";
import PrivacyPolicy from './pages/PrivacyPolicy';
import Term from './pages/Term';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Solution from './pages/Solution';
import Pricing from './pages/Pricing';
import Docs from "./pages/Docs";
import Support from './pages/Support';
import Blog from "./pages/Blog";
import Roadmap from './pages/Roadmap';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>

        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>

        <Route path="/dashboard" element={<Dashboard/>}/>

        <Route path="/solution" element={<Solution/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/docs" element={<Docs/>}/>
        <Route path="/support" element={<Support/>}/>

        <Route path="/term" element={<Term/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/roadmap" element={<Roadmap/>}/>

        <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<Term/>}/>

        <Route path="*" element={<ErrorPage/>}/>

      </Routes>
    </Router>
  )
}

export default App