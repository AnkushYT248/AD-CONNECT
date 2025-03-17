import "../public/css/App.css";
import "../public/css/font.css";
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { ForgotPassword } from './pages/ForgotPassword';
import { Wait } from './constend/Wait';
  import { OnBoard } from './constend/OnBoard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/wait" element={<Wait />} />
        <Route path="/onboard" element={<OnBoard />} />
      </Routes>
    </Router>
  )
}
