import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MyMain from "../components/Manage/Main";
import TopBar from "../components/PagesAdmin/TopBar";
import SidebarMenu from "../components/PagesAdmin/SidebarMenu";
import ManageProduct from "../components/Manage/ManageProduct";
import ManageUser from "../components/Manage/ManageUser";// Add this import
import ManageProductCategories from "../components/Manage/ManageProductCategories";
import ManageBrand from "../components/Manage/ManageBrand";
import UserManagement from "../components/Manage/ManageUser";
import ProductDetailManager from "../components/Manage/ManageProductDetail";
import ManageProductColors from "../components/Manage/ManageProductColors";
import ManageProductImages from "../components/Manage/ManageProductImages";
import ProductSizeManager from "../components/Manage/ManageProductSizes";
import ManageWeights from "../components/Manage/ManageWeights";
import ManageInventory from "../components/Manage/ManageInventory";
import ManageRole from "../components/Manage/ManageRole";



function Admin() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* TopBar will take full width at the top */}
        <header className="w-full shadow-lg bg-white">
          <TopBar />
        </header>

        <div className="flex flex-1 lg:flex-row sm:flex-col overflow-hidden">
          {/* SidebarMenu for navigation, responsive */}
          <aside className="lg:w-1/6 sm:w-full bg-white shadow-md">
            <SidebarMenu />
          </aside>

          {/* Main Content adjusts based on the route */}
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            <Routes>
              <Route path="/" element={<MyMain />} />
              <Route path="/about" element={<ManageUser />} /> {/* Fix the path */}
              <Route path="/products" element={<ManageProduct />} />
              <Route path="/product-categories" element={<ManageProductCategories />}
               /> {/* Add this route */}
              {/* Add more routes as needed */}
              <Route path="/brands" element={<ManageBrand />} /> {/* Add this route */}
              <Route path="/user" element={<UserManagement />} /> {/* Add this route */}
              <Route path="/roles" element={<ManageRole />} /> {/* Add this route */}
              <Route path="/product-details" element={<ProductDetailManager />} /> {/* Add this route */}
              <Route path="/product-color" element={<ManageProductColors />} /> {/* Add this route */}
              <Route path="/product-image" element={<ManageProductImages />} /> {/* Add this route */}
              <Route path="/product-size" element={<ProductSizeManager />} /> {/* Add this route */}
              
              <Route path="/product-weights" element={<ManageWeights />} /> {/* Add this route */}
              <Route path="/product-inventory" element={<ManageInventory />} /> {/* Add this route */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default Admin;
