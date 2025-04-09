import "./output.css";
import Navbar from "./components/Navbar";
import GreetComp from "./components/GreetComp";
import Menu from "./components/Menu";
import MainIngredients from "./components/MainIngredients";
import RandomMeal from "./components/RandomMeal";
import Footer from "./components/footer";
import FrequentProducts from "./components/FrequentProducts";
import { useEffect, useState } from "react";
import axios from "axios";
import SuggestionModal from "./components/SuggestModel";
import SuggestProduct from "./components/SuggestProduct";
import { Toaster } from "sonner";

function App() {
  const userMail = localStorage.getItem("useremail");
  const [cartCount, setCartCount] = useState(false);
  const [SelectedCategory, SetSelectedCategory] = useState([]);
  const [showSuggestionOnce, setShowSuggestionOnce] = useState(false);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("shownSuggestion");

    const getTransactionData = async () => {
      try {
        if (!userMail || alreadyShown === "true") return;

        const res = await axios.get("http://localhost:5000/UserProductCount", {
          params: { email: userMail },
        });

        const totalItems = res?.data?.totalItems || 0;

        if (totalItems === 0) {
          setCartCount(true); // Show modal
        }
        console.log(res?.data?.totalItems, "Transaction");
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    getTransactionData();
  }, [userMail]);

  function selectCategory(label) {
    SetSelectedCategory(label);
  }

  function handleCloseModal() {
    setCartCount(false);
    localStorage.setItem("shownSuggestion", "true"); // Mark modal as shown
    setShowSuggestionOnce(true);
  }

  return (
    <>
      <div
      // style={{ backgroundImage: "url('./src/assets/hero-bg.jpg')" }}
      >
        {/* <Toaster position="top-center" /> */}
        <Toaster position="bottom-right" richColors closeButton />

        <Navbar />
        <div className="flex items-center justify-center h-full">
          {cartCount && (
            <SuggestionModal
              selectCategory={selectCategory}
              onClose={handleCloseModal}
            />
          )}
        </div>

        <GreetComp />
      </div>

      <div className="flex flex-col bg-slate-900 h-full text-white">
        <SuggestProduct products={SelectedCategory} />
        <FrequentProducts />
      </div>

      <div className="flex flex-col bg-slate-900">
        <Menu />
        <MainIngredients />
        <RandomMeal />
        <Footer />
      </div>
    </>
  );
}

export default App;
