import { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "../axios";
import useAuth from "../context/AuthContext";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser, token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpgradeToAuthor = async () => {
    try {
      setLoading(true);
      const response = await axios.put("/users/settings/role", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      enqueueSnackbar("Successfully upgraded to author", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error upgrading role", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      enqueueSnackbar("Please select an image", { variant: "warning" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", selectedFile);

      const response = await axios.put("/users/settings", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data);
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
      onClose();
    } catch (error) {
      console.log(error);

      enqueueSnackbar(
        error.response?.data?.message || "Error updating profile",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Profile Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={previewImage || user?.displayPicture}
                alt={user?.username}
                className="h-24 w-24 rounded-full object-cover"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1 cursor-pointer hover:bg-indigo-700"
              >
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="mt-4 text-center">
              <h4 className="font-medium text-gray-900">{user?.username}</h4>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          {user?.role === "user" && (
            <button
              onClick={handleUpgradeToAuthor}
              disabled={loading}
              className="mt-3 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Upgrading..." : "Become an Author"}
            </button>
          )}
          <div className="mt-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedFile}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;