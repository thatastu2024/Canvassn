import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const NoDataFound = ({ message = "No data available", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg p-6 shadow-md">
      <FaExclamationTriangle className="text-gray-500 text-4xl mb-3" />
      <p className="text-gray-700 text-lg font-semibold">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default NoDataFound;
