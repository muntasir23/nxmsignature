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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
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
            <Route path="/customerview" element={<NexmodeCustomerLookup />} />
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
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
