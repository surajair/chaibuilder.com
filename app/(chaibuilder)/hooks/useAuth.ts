/**
 * This is a mock implementation of the useAuth hook.
 * It is used to simulate the authentication process.
 * @returns {Object} An object containing the user, logout, isLoggedIn, loading, and error properties.
 */
export const useAuth = () => {
  return {
    user: {
      authToken: "mock-auth-token",
      id: "mock-user-uid",
      name: "John Doe",
      email: "john.doe@example.com",
      photoURL: "https://placehold.co/40x40",
    },
    logout: () => {
      localStorage.removeItem("isLoggedIn");
      window.location.reload();
    },
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    loading: false,
    error: null,
    login: () => {
      localStorage.setItem("isLoggedIn", "true");
      window.location.reload();
    },
  };
};
