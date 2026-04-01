import React from "react";

const RequireRole = ({ role, children }) => {
  const userData = localStorage.getItem("userData");
  if (!userData) {
    return (
      <div style={styles.denied}>
        Access Denied !
      </div>
    );
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch (error) {
    return (
      <div style={styles.denied}>
        Invalid User Data
      </div>
    );
  }

  const isAuthorized = Array.isArray(role)
    ? role.includes(user.role)
    : role === user.role;

  if (!isAuthorized) {
    return (
      <div style={styles.denied}>
        Access Denied !
      </div>
    );
  }

  return <>{children}</>;
};

const styles = {
  denied: {
    color: "#FF0000",
    display: "flex",
    height: "50vh",
    fontWeight: "700",
    fontSize: "2rem",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default RequireRole;