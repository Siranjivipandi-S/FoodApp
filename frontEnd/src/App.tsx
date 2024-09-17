import "./output.css";
import Navbar from "./components/Navbar";
import GreetComp from "./components/GreetComp";
import Menu from "./components/Menu";
import MainIngredients from "./components/MainIngredients";
import RandomMeal from "./components/RandomMeal";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div
        className="relative min-w-full h-screen bg-cover bg-center bgimage z-20"
        style={{ backgroundImage: "url('./src/assets/hero-bg.jpg')" }}
      >
        <Toaster position="top-center" />
        <Navbar />
        <GreetComp />
      </div>
      <div className="flex flex-col">
        <Menu />
        <MainIngredients />
        <RandomMeal />
        <Footer />
      </div>
    </>
  );
}

export default App;
