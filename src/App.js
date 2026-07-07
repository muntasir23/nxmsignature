import { BrowserRouter, Route, Routes } from "react-router-dom";
import InvoiceCreate from "./components/InvoiceCreate";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import AddProduct from "./pages/AddProduct";
import EditInvoice from "./pages/EditInvoice";
import EditProduct from "./pages/EditProduct";
import Home from "./pages/Home";
import InvoiceList from "./pages/InvoiceList";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import NexmodeAdminEntry from "./pages/NexmodeAdminEntry";
import NexmodeAdminDashboard from "./pages/NexmodeAdminDashboard";
import NexmodeCustomerLookup from "./pages/NexmodeCustomerLookup";
import RewardManager from "./pages/RewardManager";
import NexmodeAdminStation from "./pages/NexmodeAdminStation";
import FirebaseShirtsShowcase from "./pages/FirebaseShirtsShowcase";
import FirebasePoloShowcase from "./pages/FirebasePoloShowcase";
import FirebasePantsShowcase from "./pages/FirebasePantsShowcase";
import ShopPage from "./pages/ShopPage";
import { CartProvider } from "./context/Cartcontext";
import CartAndCheckoutDrawer from "./components/CartAndCheckoutDrawer";
import ShopPageNew from "./pages/ShopPageNew";
import CustomerProfileTrack from "./pages/CustomerProfileTrack";
import AdminDashboard from "./pages/AdminDashboard";
import StoreFooter from "./components/StoreFooter";
import ProductDetailsPage from "./pages/ProductDetailsPage"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartAndCheckoutDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rewardsnew" element={<RewardManager />} />
              <Route
                path="/adminstation"
                element={
                  <PrivateRoute>
                    {" "}
                    <NexmodeAdminStation />
                  </PrivateRoute>
                }
              />
              <Route path="/shirts" element={<FirebaseShirtsShowcase />} />
              <Route path="/polo" element={<FirebasePoloShowcase />} />
              <Route path="/pants" element={<FirebasePantsShowcase />} />
              {/* <Route path="/cart" element={<CartAndCheckoutDrawer />} /> */}
              <Route path="/shop" element={<ShopPageNew />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route
                path="/customerprofile"
                element={<CustomerProfileTrack />}
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    {" "}
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/shopolderversion" element={<ShopPage />} />
              <Route
                path="/add"
                element={
                  <PrivateRoute>
                    {" "}
                    <AddProduct />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditProduct />
                  </PrivateRoute>
                }
              />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route
                path="/adminentry"
                element={
                  <PrivateRoute>
                    <NexmodeAdminEntry />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admindashboard"
                element={
                  <PrivateRoute>
                    {" "}
                    <NexmodeAdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/rewards" element={<NexmodeCustomerLookup />} />
              <Route
                path="/invoice"
                element={
                  <PrivateRoute>
                    <InvoiceCreate />
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoicelist"
                element={
                  <PrivateRoute>
                    {" "}
                    <InvoiceList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/editinvoice/:id"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditInvoice />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
            </Routes>
            <StoreFooter />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
