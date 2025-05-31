import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import Term from "./pages/Term";
import PrivacyPolicy from "./pages/PrivacyPolicy";





const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
        <Route path="/term" element={<Term/>} />
      </Routes>
    </Router>
  )
}

export default App