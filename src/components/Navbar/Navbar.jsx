import React from "react";
import { Container } from "@mui/material";
import "./navbar.css";

const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <Container maxWidth="md">
      <div className="tabs">
        <Container
          className={`tab ${activeTab === "summarise" ? "active" : ""}`}
          onClick={() => onTabChange("summarise")}
        >
          Summarise
        </Container>
        <Container
          className={`tab ${activeTab === "elaborate" ? "active" : ""}`}
          onClick={() => onTabChange("elaborate")}
        >
          Elaborate
        </Container>
        <Container
          className={`tab ${activeTab === "research" ? "active" : ""}`}
          onClick={() => onTabChange("research")}
        >
          Research
        </Container>
        <Container
          className={`tab ${activeTab === "chat-with-pdf" ? "active" : ""}`}
          onClick={() => onTabChange("chat-with-pdf")}
        >
          Chat With PDF
        </Container>
      </div>
      <div
        className="indicator"
        style={{
          left:
            activeTab === "summarise"
              ? "0%"
              : activeTab === "elaborate"
              ? "25%"
              : activeTab === "research"
              ? "50%"
              : "75%",
        }}
      />
    </Container>
  );
};

export default Navbar;
