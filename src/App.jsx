import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainFeed from './pages/MainFeed';
import ContentDetail from './pages/ContentDetail';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/detail/:id" element={<ContentDetail />} />
        <Route path="/explore" element={<PlaceholderPage title="Explore" />} />
        <Route path="/saved" element={<PlaceholderPage title="Saved" />} />
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="*" element={<MainFeed />} />
      </Routes>
    </Router>
  );
}

export default App;
