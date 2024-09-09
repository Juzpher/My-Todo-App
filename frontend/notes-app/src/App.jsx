import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
);

const App = () => {
  return (
    <>
      {/* <div className="max-w-screen-2xl mx-auto">
        <div className="min-h-[calc(100vh-96px)]">{routes}</div>
      </div> */}
      <div>
        <div>{routes}</div>
      </div>
    </>
  );
};
export default App;
