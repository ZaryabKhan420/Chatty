import React from "react";
import { useNavigate } from "react-router-dom";
const ErrorBoundaryFallbackUI = () => {
  const navigate = useNavigate();
  return (
    <div className="container flex flex-col justify-center items-center gap-5 w-screen h-screen">
      <h1 className="text-lg font-bold text-center">
        Whoops, something went wrong.
      </h1>
      <p className="text-center">
        Please either refresh the page or return home to try again.
      </p>
      <p className="text-center">
        If the issue continues, please{" "}
        <a href="#" className="text-red">
          get in touch.
        </a>
      </p>
      <button
        onClick={() => navigate("/")}
        className="btn btn-error text-white"
      >
        Go home
      </button>
      <p className="text-red-500">Error:</p>
    </div>
  );
};

export default ErrorBoundaryFallbackUI;
