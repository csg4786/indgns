import { useState } from 'react'
import './App.css'
import { Navbar } from './components'
import { Research, ChatWithPdf } from './pages';
import { Chip, Container, Stack } from '@mui/material';
import { Replay } from "@mui/icons-material";

function App() {
  const [activeTab, setActiveTab] = useState("summarise");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "summarise":
          return <></>;
      case "elaborate":
        return <></>;
      case "research":
        return <Research />;
      case "chat-with-pdf":
        return <ChatWithPdf />;
      default:
        return <></>;
    }
  };
  
  const handleClick = () => {
    console.info('');
  };

  const handleDelete = () => {
    console.info('');
  };

  return (
    <>
      <div className="main">
        <Container maxWidth={"md"} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Chip
            label={"Originality Score 0% "}
            color="success"
            onClick={handleClick}
            onDelete={handleDelete}
            deleteIcon={<Replay />}
            sx={{ 
              marginLeft: "auto",
              width: "20%" 
            }}
          />
        </Container>
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
        {renderTab()}
      </div>
    </>
  );
}

export default App
