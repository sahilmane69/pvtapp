import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'FARMER' | 'DELIVERY' | null;

interface AuthContextType {
     userRole: UserRole;
     setUserRole: (role: UserRole) => Promise<void>;
     isLoading: boolean;
     logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
     const [userRole, setRoleState] = useState<UserRole>(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          loadUserRole();
     }, []);

     const loadUserRole = async () => {
          try {
               const storedRole = await AsyncStorage.getItem('userRole');
               if (storedRole) {
                    setRoleState(storedRole as UserRole);
               }
          } catch (error) {
               console.error('Failed to load user role:', error);
          } finally {
               setIsLoading(false);
          }
     };

     const setUserRole = async (role: UserRole) => {
          try {
               if (role) {
                    await AsyncStorage.setItem('userRole', role);
               } else {
                    await AsyncStorage.removeItem('userRole');
               }
               setRoleState(role);
          } catch (error) {
               console.error('Failed to save user role:', error);
          }
     };

     const logout = async () => {
          await setUserRole(null);
     };

     return (
          <AuthContext.Provider value={{ userRole, setUserRole, isLoading, logout }}>
               {children}
          </AuthContext.Provider>
     );
};


export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
};
