import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import useGetCurrentUser from "./customHooks/useGetCurrentUser";
import useGetCreatorCourse from "./customHooks/useGetCreatorCourse";
import useGetCourse from "./customHooks/useGetCourse";

import RoleGuard from "./components/RoleGuard";
import NotFound from "./components/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import useGetReview from "./customHooks/useGetReview";

export const serverURL = import.meta.env.VITE_SERVER_URL;

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const AllCourses = lazy(() => import("./pages/AllCourses"));
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const ViewLecture = lazy(() => import("./pages/ViewLecture"));
const MyEnrolledCourses = lazy(() => import("./pages/MyEnrolledCourses"));

// Educator pages (lazy-loaded too)
const Dashboard = lazy(() => import("./pages/Educator/Dashboard"));
const CreateCourse = lazy(() => import("./pages/Educator/CreateCourse"));
const EditCourse = lazy(() => import("./pages/Educator/EditCourse"));
const Courses = lazy(() => import("./pages/Educator/Courses"));
const CreateLecture = lazy(() => import("./pages/Educator/CreateLecture"));
const EditLecture = lazy(() => import("./pages/Educator/EditLecture"));

const App = () => {
  const loadingUser = useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);

  const loadingCourses = useGetCreatorCourse();
  const courseData = useGetCourse();
  const reviewData = useGetReview();

  // Keep initial blank state until user & courses are loaded
  if (
    loadingUser ||
    (userData?.role === "educator" && loadingCourses) ||
    courseData ||
    reviewData
  ) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <ScrollToTop />

      {/* Suspense Loader for lazy-loaded pages */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <img
              src="/logo.png"
              alt="logo"
              className="w-12 h-12 rounded border border-white/50 p-1 bg-black"
            />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={userData ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!userData ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!userData ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={userData ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit"
            element={userData ? <EditProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/allcourses"
            element={userData ? <AllCourses /> : <Navigate to="/login" />}
          />
          <Route
            path="/viewcourse/:courseId"
            element={userData ? <ViewCourse /> : <Navigate to="/login" />}
          />
          <Route
            path="/viewlecture/:courseId"
            element={userData ? <ViewLecture /> : <Navigate to="/login" />}
          />
          <Route
            path="/mycourses"
            element={
              userData ? <MyEnrolledCourses /> : <Navigate to="/login" />
            }
          />

          {/* Educator Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <RoleGuard user={userData} allowedRole="educator" redirectTo="/">
                <Dashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/create-course"
            element={
              <RoleGuard user={userData} allowedRole="educator" redirectTo="/">
                <CreateCourse />
              </RoleGuard>
            }
          />
          <Route
            path="/courses"
            element={
              <RoleGuard user={userData} allowedRole="educator" redirectTo="/">
                <Courses />
              </RoleGuard>
            }
          />
          <Route
            path="/edit-course/:id"
            element={
              <RoleGuard user={userData} allowedRole="educator" redirectTo="/">
                <EditCourse />
              </RoleGuard>
            }
          />
          <Route
            path="/createlecture/:id"
            element={
              <RoleGuard user={userData} allowedRole="educator" redirectTo="/">
                <CreateLecture />
              </RoleGuard>
            }
          />
          <Route
            path="/editlecture/:courseId/:lectureId"
            element={
              <RoleGuard user={userData} allowedRole="educator" redirectTo="/">
                <EditLecture />
              </RoleGuard>
            }
          />

          {/* Public Forgot Password */}
          <Route
            path="/forgot-password"
            element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
