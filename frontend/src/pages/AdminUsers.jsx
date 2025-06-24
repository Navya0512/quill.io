import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "../axios";
import useAuth from "../context/AuthContext";
import Navbar from "../components/Navbar";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      
      setUsers(res.data);
    } catch (error) {
        console.log(error);
        
      enqueueSnackbar(error.response?.data?.message || "Error fetching users", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (userId, userRole) => {
    // Prevent deletion of admin users
    if (userRole === 'admin') {
      enqueueSnackbar("Cannot delete admin users", { variant: "error" });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?" + 
      (userRole === 'author' ? "\nAll their blogs will also be deleted!" : ""))) {
      return;
    }

    try {
      await axios.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar("User deleted successfully", { variant: "success" });
      fetchUsers();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error deleting user", {
        variant: "error",
      });
    }
  };

  const handleUpgradeToAuthor = async (userId) => {
    try {
      await axios.put(
        `/admin/users/${userId}/role`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar("User upgraded to author successfully", { variant: "success" });
      fetchUsers();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error upgrading user", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user._id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.displayPicture}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg font-medium text-gray-900">{user.username}</h2>
                          {(user.role === 'admin' || user.role === 'author') && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {user.role === 'user' ? (
                        <button
                          onClick={() => handleUpgradeToAuthor(user._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Upgrade to Author
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {user.role === 'admin' ? 'Administrator' : 'Author'}
                        </span>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user._id, user.role)}
                          className="inline-flex items-center text-red-600 hover:text-red-900"
                        >
                          <svg 
                            className="h-5 w-5 mr-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;