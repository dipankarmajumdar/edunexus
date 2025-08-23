import { CiWarning } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-dark dark:text-light">
      <div class="p-4 space-y-4">
        <div class="flex flex-col items-start space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-3">
          <p class="font-semibold text-red-500 text-8xl dark:text-red-600 animate-pulse blink 1s infinite">
            404
          </p>
          <div class="space-y-2">
            <h1 id="pageTitle" class="flex items-center space-x-2">
              <CiWarning size={30} className="text-red-500" />
              <span class="text-xl font-medium text-gray-600 sm:text-2xl dark:text-light">
                Oops! Page not found.
              </span>
            </h1>
          </div>
        </div>

        <div
          onClick={() => navigate("/")}
          class="flex items-center justify-center"
        >
          <button class="bg-gray-800 text-white px-5 py-2 rounded-tr-lg rounded-bl-lg active:bg-gray-700 cursor-pointer font-light text-md">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
