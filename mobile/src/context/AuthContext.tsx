import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'FARMER' | 'DELIVERY' | 'ADMIN' | null;

export interface AuthUser {
     id: string;
     username: string;
     role: UserRole;
}

interface AuthContextType {
     userRole: UserRole;
     setUserRole: (role: UserRole) => Promise<void>;
     isLoading: boolean;
     logout: () => Promise<void>;
     user: AuthUser | null;
     setUser: (user: AuthUser | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
     const [userRole, setRoleState] = useState<UserRole>(null);
     const [isLoading, setIsLoading] = useState(true);
     const [user, setUserState] = useState<AuthUser | null>(null);

     useEffect(() => {
          const loadAuth = async () => {
               try {
                    const storedRole = await AsyncStorage.getItem('userRole');
                    const storedUser = await AsyncStorage.getItem('authUser');

                    if (storedRole) {
                         setRoleState(storedRole as UserRole);
                    }

                    if (storedUser) {
                         const parsed: AuthUser = JSON.parse(storedUser);
                         setUserState(parsed);
                    }
               } catch (error) {
                    console.error('Failed to load auth state:', error);
               } finally {
                    setIsLoading(false);
               }
          };

          loadAuth();
     }, []);

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

     const setUser = async (authUser: AuthUser | null) => {
          try {
               if (authUser) {
                    await AsyncStorage.setItem('authUser', JSON.stringify(authUser));
                    setUserState(authUser);
               } else {
                    await AsyncStorage.removeItem('authUser');
                    setUserState(null);
               }
          } catch (error) {
               console.error('Failed to save auth user:', error);
          }
     };

     const logout = async () => {
          await setUserRole(null);
          await setUser(null);
     };

     return (
          <AuthContext.Provider value={{ userRole, setUserRole, isLoading, logout, user, setUser }}>
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
