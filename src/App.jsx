import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainFeed from './pages/MainFeed';
import ContentDetail from './pages/ContentDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/detail/:id" element={<ContentDetail />} />
        <Route path="*" element={<MainFeed />} />
      </Routes>
    </Router>
  );
}

export default App;
