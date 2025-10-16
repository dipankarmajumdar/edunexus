import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverURL } from "../App";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateFormData, setUpdateFormData] = useState({
    name: userData.name || "",
    description: userData.description || "",
    photoUrl: null,
  });
  const [loading, setLoading] = useState(false);

  const formData = new FormData();
  formData.append("name", updateFormData.name);
  formData.append("description", updateFormData.description);
  formData.append("photoUrl", updateFormData.photoUrl);

  /* Update Profile */
  const updateProfile = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${serverURL}/api/users/profile`,
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(data.user));

      toast.success("Profile update successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error?.response?.data?.message || "Profile update failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      {/* Navbar */}
      <Navbar />

      {/* Edit Section */}
      <div className="flex justify-center items-center mt-14 px-3 py-4 min-h-[calc(100vh-64px)] overflow-hidden">
        <div className="bg-white shadow-2xl rounded-xl w-full min-w-md overflow-hidden">
          {/* Form Section */}
          <div className="flex flex-col justify-center p-4 sm:p-5 gap-3">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your personal information
              </p>
            </div>

            {/* Profile Photo */}
            <div className="flex flex-col items-center mt-2">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                {updateFormData.photoUrl ? (
                  <img
                    src={updateFormData.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black text-white text-3xl">
                    {userData?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <label htmlFor="avatar" className="cursor-pointer mt-2 text-sm">
                Change Photo
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUpdateFormData((prev) => ({
                      ...prev,
                      photoUrl: file,
                    }));
                  }
                }}
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fname"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="fname"
                type="text"
                value={updateFormData.name}
                onChange={(e) =>
                  setUpdateFormData({ ...updateFormData, name: e.target.value })
                }
                className="w-full h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-sm"
                placeholder={userData.name || "Enter your name"}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-sm"
                readOnly
                placeholder={userData.email || "Enter your email"}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={updateFormData.description}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    description: e.target.value,
                  })
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 text-sm resize-none"
                placeholder={
                  userData.description || "Tell something about yourself..."
                }
              />
            </div>

            {/* Save Button */}
            <button
              onClick={updateProfile}
              className="w-full h-9 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
