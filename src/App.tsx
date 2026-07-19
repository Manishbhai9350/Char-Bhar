import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home/home";
import Local from "./pages/local/local";
import SinglePlayer from "./pages/singlePlayer/singlePlayer";

const App = () => {
  return (
    <div className="char-bhar">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/single" element={<SinglePlayer />} />
          <Route path="/local" element={<Local />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
