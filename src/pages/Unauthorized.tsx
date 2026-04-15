import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Unauthorized = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("403 Error: Unauthorized user attempted to access route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">403</h1>
        <p className="mb-4 text-xl text-gray-600">Unauthorized Access</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
