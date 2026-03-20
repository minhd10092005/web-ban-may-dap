import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./features/about/About";
import Contact from "./features/contact/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;