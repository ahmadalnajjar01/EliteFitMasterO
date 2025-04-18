// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";


// // Layout
// import NavBar from "./layout/NavBar";
// import Footer from "./layout/Footer";

// // Pages
// import Home from "./pages/Home";
// import ProductDetails from "./pages/ProductDetails";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import SearchResults from "./pages/SearchResults";


// // Theme
// import { ThemeProvider } from "./components/home/ThemeProvider";
// import Tech from "./pages/Technology";
// import Favorite from "./pages/Favorite";
// import NewArrivals from "./components/catagories/NewArrivals";
// import Men from "./components/catagories/Men";
// import Women from "./components/catagories/Women";
// import Kids from "./components/catagories/Kids";
// import Sale from "./components/catagories/Sale";
// import Profile from "./pages/Profile";
// import OccasionProducts from "./components/catagories/OccasionProducts";  
// import AllProducts from "./components/catagories/AllProducts";

  

// function Layout() {
//   const location = useLocation();


//   // Hide Navbar and Footer on specific pages
//   const hideNavAndFooter = [
//     "/login",
//     "/signup",
//     "/checkout",
//     "/verify-email",
//     "/cart",
//   ].includes(location.pathname);

//   return (
//     <>
//       {!hideNavAndFooter && <NavBar />}

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/product/:id" element={<ProductDetails />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/occasion/:occasionName" element={<OccasionProducts />} />
//         <Route path="/products" element={<AllProducts />} />

//         <Route path="/tech" element={<Tech />} />
//         <Route path="/favorite" element={<Favorite />} />
//         <Route path="/new" element={<NewArrivals />} />
//         <Route path="/men" element={<Men />} />
//         <Route path="/women" element={<Women />} />
//         <Route path="/kids" element={<Kids />} />
//         <Route path="/sale" element={<Sale />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/search" element={<SearchResults />} />
//       </Routes>

//       {!hideNavAndFooter && <Footer />}
//     </>
//   );
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <Router>
//         <Layout />
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;




// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./store";

// Layout
import NavBar from "./layout/NavBar";
import Footer from "./layout/Footer";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
import Tech from "./pages/Technology";
import Favorite from "./pages/Favorite";
import Profile from "./pages/Profile";

// Categories
import NewArrivals from "./components/catagories/NewArrivals";
import MenCategory from "./components/catagories/Men";
import Women from "./components/catagories/Women";
import Kids from "./components/catagories/Kids";
import Sale from "./components/catagories/Sale";
import OccasionProducts from "./components/catagories/OccasionProducts";
import AllProducts from "./components/catagories/AllProducts";

// Theme
import { ThemeProvider } from "./components/home/ThemeProvider";

// Async fetch actions from slices
import { fetchMenProducts } from "./Slices/menSlice";
import { fetchKidsProducts } from "./Slices/kidsSlice";
import { fetchTrendingItems } from "./Slices/trendingSlice";
// import { fetchWomenProducts } from "./Slices/womenSlice"; // Uncomment if available

// Layout component: renders NavBar, Routes, and Footer
function Layout() {
  const location = useLocation();

  // Hide Navbar and Footer on specific pages
  const hideNavAndFooter = [
    "/login",
    "/signup",
    "/checkout",
    "/verify-email",
    "/cart",
  ].includes(location.pathname);

  return (
    <>
      {!hideNavAndFooter && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/occasion/:occasionName" element={<OccasionProducts />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/tech" element={<Tech />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/new" element={<NewArrivals />} />
        <Route path="/men" element={<MenCategory />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>

      {!hideNavAndFooter && <Footer />}
    </>
  );
}

// Main App component: dispatches fetch actions and renders Layout
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch asynchronous actions to load product data
    dispatch(fetchMenProducts());
    dispatch(fetchKidsProducts());
    dispatch(fetchTrendingItems());
    // dispatch(fetchWomenProducts()); // Uncomment if you have a women slice
  }, [dispatch]);

  return <Layout />;
}

// Wrap App with Redux Provider, ThemeProvider, and Router
function AppWrapper() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default AppWrapper;
