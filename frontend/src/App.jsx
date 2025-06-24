import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./context/AuthContext";
import AuthorDashboard from "./pages/AuthorDashboard";
import EditBlog from "./pages/EditBlog";
import CreateBlog from "./pages/CreateBlog";
import AdminUsers from "./pages/AdminUsers";
import AdminBlogs from "./pages/AdminBlogs";
import AdminDashboard from "./pages/AdminDashBoard";
import SingleBlog from "./pages/SingleBlog/SingleBlog";

const App = () => {
  let { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route
        path="/blog/:slug"
        element={
          <ProtectedRoute>
            <SingleBlog />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AuthorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-blog/:slug"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-blog"
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminBlogs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
export default App;