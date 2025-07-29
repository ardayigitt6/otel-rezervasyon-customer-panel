import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchRooms from "./pages/SearchRooms";

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>OTEL REZERVASYON SİSTEMİ</h1>
      <Link to="/login"><button>Giriş Yap</button></Link>
      <Link to="/register"><button>Kayıt Ol</button></Link>
      <Link to="/search-rooms"><button>Oda Ara</button></Link>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search-rooms" element={<SearchRooms />} />
      </Routes>
    </Router>
  );
}

export default App;
