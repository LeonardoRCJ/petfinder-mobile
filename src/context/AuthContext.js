import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import decodeJWT from '../services/decodeJWT';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    loading: true
  });

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedToken) {
        try {
          const decoded = decodeJWT(storedToken);
          setAuthState({
            token: storedToken,
            user: {
              id: decoded.id,
              email: decoded.email,
              role: decoded.role || 'USER' 
            },
            loading: false
          });
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          await AsyncStorage.removeItem('token');
          setAuthState({
            token: null,
            user: null,
            loading: false
          });
        }
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    loadAuthData();
  }, []);

  const login = async (newToken) => {
    try {
      const decoded = decodeJWT(newToken);
      await AsyncStorage.setItem('token', newToken);
      
      setAuthState({
        token: newToken,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role || 'USER'
        },
        loading: false
      });
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setAuthState({
      token: null,
      user: null,
      loading: false
    });
  };


  const isAdmin = () => {
    return authState.user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider 
      value={{
        token: authState.token,
        user: authState.user,
        loading: authState.loading,
        isAdmin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};