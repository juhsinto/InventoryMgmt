import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import InventoryDetail from "./pages/InventoryDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Unauthorized from "./pages/Unauthorized";
import UserManagement from "./pages/UserManagement";
import SignUp from "./pages/SignUp";
import InventoryDash from "./pages/InventoryDash";
import InventoryAdd from "./pages/InventoryAdd";
import CategoryAdd from "./pages/CategoryAdd";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/inventory" element={<InventoryDash />} />
            <Route path="/inventory_add" element={<InventoryAdd />} />
            <Route path="/category_add" element={<CategoryAdd />} />
            <Route path="/inventory/:id" element={<InventoryDetail />} />
            <Route path="/user_management" element={<UserManagement />} />
          </Route>

          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
