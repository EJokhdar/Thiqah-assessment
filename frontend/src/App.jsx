import React from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
