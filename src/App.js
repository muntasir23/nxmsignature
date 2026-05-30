import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import InvoiceCreate from "./components/InvoiceCreate";
import InvoiceList from "./pages/InvoiceList";
import EditInvoice from "./pages/EditInvoice";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/invoice" element={<InvoiceCreate />} />
          <Route path="/invoicelist" element={<InvoiceList />} />
          <Route path="/editinvoice/:id" element={<EditInvoice />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
