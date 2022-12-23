import React from 'react';
import { Route, Routes } from "react-router-dom"
import MainPage from './MainPage';
import FirstPage from './FirstPage';

function App(props) {
    return (
        <Routes>
            {/* <Route path="/" element={<FirstPage />} /> */}
            <Route path="/" element={<MainPage />} />
        </Routes>
    );
}

export default App;