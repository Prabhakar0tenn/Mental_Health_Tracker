import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Chat from "./Pages/Chat";
import Diary from "./Pages/Diary";
import Forum from "./Pages/Forum";
import Resources from "./Pages/Resources";
import Booking from "./Pages/Booking";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
