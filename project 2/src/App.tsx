import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteCreator from './components/NoteCreator';
import NoteList from './components/NoteList';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <NotesProvider>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64 pt-16">
              <Routes>
                <Route path="/" element={
                  <>
                    <NoteCreator />
                    <NoteList />
                  </>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </NotesProvider>
    </Router>
  );
}

export default App