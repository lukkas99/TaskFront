import { useState, useEffect } from "react";

/**
 * Hook personalizado para gerenciar autenticação
 */
export function useAuth(authService) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setError(null);
    return result;
  };

  const register = async (name, email, password, confirmPassword) => {
    const result = await authService.register(name, email, password, confirmPassword);
    setUser(result.user);
    setError(null);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
