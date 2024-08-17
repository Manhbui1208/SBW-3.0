// App.js
import React from "react";
import Header from "./Header";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar"; // Import the Sidebar component
import Feed from "./Feed";
import Footer from "./Footer"; // Import Footer component
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <Sidebar />
        <MainContent />
        <Feed />
      </div>
      <Footer />
    </div>
  );
}

export default App;
