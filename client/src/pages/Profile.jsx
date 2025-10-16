import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      {/* Navbar */}
      <Navbar />

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-16 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-3xl">
          <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-800 text-white flex items-center justify-center text-4xl font-semibold shadow">
                  {userData?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="mt-6 md:mt-0 flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {userData?.name}
              </h2>
              <p className="text-gray-500 capitalize text-center md:text-start lg:text-start">
                {userData?.role}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-center lg:justify-start md:justify-start">
                <button
                  onClick={() => navigate("/edit")}
                  className="px-5 py-2 text-sm rounded-lg bg-black text-white active:bg-gray-700 transition cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{userData?.email}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Bio</p>
              <p className="font-medium text-gray-800">
                {userData?.description || "No description available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Enrolled Courses</p>
              <p className="font-medium text-gray-800">
                {userData?.enrolledCourses?.length || "No course enrolled"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-800">
                {new Date(userData?.createdAt).toLocaleDateString() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
