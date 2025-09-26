import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import LessonFocus from './pages/LessonFocus';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="module/:moduleId" element={<ModulePage />} />
                <Route path="module/:moduleId/lesson/:lessonId" element={<LessonPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
              <Route path="/focus/module/:moduleId/lesson/:lessonId" element={<LessonFocus />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;