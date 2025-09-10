import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import DetailPage from "./pages/DetailPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";


const App = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage/>} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
