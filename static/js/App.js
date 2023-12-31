import "./App.css";
import Navbar from "./components/Navbar";
import Staking from "./components/Staking";

function App() {
  return (
    <div style={{
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      flexDirection: "column",
      backgroundColor: "rgb(20 20 20)",
    }}>
      
      <Navbar />
      <Staking />
      
    </div>
  );
}

export default App;
