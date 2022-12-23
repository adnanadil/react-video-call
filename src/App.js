import React from 'react';
import { Route, Routes } from "react-router-dom"
import MainPage from './MainPage';

function App(props) {
    return (
        <Routes>
            <Route path="/new" element={<MainPage />} />
            {/* <Route path="/books" element={<BookList />} /> */}
        </Routes>
    );
}

export default App;