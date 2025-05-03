import "./App.css";
import MemoryGame from "./components/memory-game";

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <MemoryGame />
    </div>
  );
}

export default App;
