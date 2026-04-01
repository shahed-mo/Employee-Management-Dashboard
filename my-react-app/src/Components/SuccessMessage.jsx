import React from "react";

const SuccessMessage = ({ message }) => {

  if (!message) return null;

  const isError =
    message.toLowerCase().includes("incorrect") ||
    message.toLowerCase().includes("not") ||
    message.toLowerCase().includes("error");

  return (
    <div className={`message ${isError ? "error" : "success"}`}>
      {message}
    </div>
  );
};

export default SuccessMessage;