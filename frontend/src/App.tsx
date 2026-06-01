import {BrowserRouter,Route,Routes}from 'react-router-dom';
import Home from "./pages/home/Home"
import Header from './components/header/Header';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import EditProduct from './pages/dashboard/EditProduct';
import Categories from './pages/categories/Categories';
import Orders from './pages/orders/Orders';
import Admin from './pages/admin/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import { AuthProvider } from './context/AuthContext';



function App() {
  return (
    < >
     <BrowserRouter>
     <AuthProvider>
     <Header/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-product/:id"
        element={
          <RoleRoute roles={["admin", "manager"]}>
            <EditProduct/>
          </RoleRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <RoleRoute roles={["admin"]}>
            <Admin/>
          </RoleRoute>
        }
      />
     </Routes>
     </AuthProvider>
     </BrowserRouter>
    </>
  );
}

export default App;
