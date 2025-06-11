import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import SingleBlog from "./pages/SingleBlog";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./context/AuthContext";
import CreateBlog from "./pages/CreateBlog";
import AuthorDashBoard from "./pages/AuthorDashBoard";
import EditBlog from "./pages/EditBlog";

const App = () => {
  let { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/blog/:slug"
        element={
          <ProtectedRoute>
            <SingleBlog />
          </ProtectedRoute>
        }
      />
      {user?.role === "author" && (
        <>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthorDashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/create-blog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit-blog/:slug"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
        </>
      )}
    </Routes>
  );
};

export default App;