import React, {
     createContext,
     useState,
     useContext,
     useCallback,
     useMemo,
     ReactNode,
     useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'CUSTOMER' | 'FARMER' | 'DELIVERY' | 'ADMIN' | null;

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

     // Load persisted auth on mount — run once
     useEffect(() => {
          let cancelled = false;

          const loadAuth = async () => {
               try {
                    const [storedRole, storedUser] = await AsyncStorage.multiGet(['userRole', 'authUser']);

                    if (cancelled) return;

                    const role = storedRole[1];
                    const rawUser = storedUser[1];

                    if (role) setRoleState(role as UserRole);

                    if (rawUser) {
                         try {
                              setUserState(JSON.parse(rawUser) as AuthUser);
                         } catch {
                              await AsyncStorage.removeItem('authUser');
                         }
                    }
               } catch {
                    // Silently fall through; user will get login screen
               } finally {
                    if (!cancelled) setIsLoading(false);
               }
          };

          loadAuth();
          return () => { cancelled = true; };
     }, []);

     const setUserRole = useCallback(async (role: UserRole) => {
          try {
               if (role) {
                    await AsyncStorage.setItem('userRole', role);
               } else {
                    await AsyncStorage.removeItem('userRole');
               }
               setRoleState(role);
          } catch {
               // Storage failure — state is still updated in memory
          }
     }, []);

     const setUser = useCallback(async (authUser: AuthUser | null) => {
          try {
               if (authUser) {
                    await AsyncStorage.setItem('authUser', JSON.stringify(authUser));
                    setUserState(authUser);
               } else {
                    await AsyncStorage.removeItem('authUser');
                    setUserState(null);
               }
          } catch {
               // Storage failure — state is still updated in memory
          }
     }, []);

     const logout = useCallback(async () => {
          try {
               await AsyncStorage.multiRemove(['userRole', 'authUser']);
          } catch { /* ignore */ }
          setRoleState(null);
          setUserState(null);
     }, []);

     // Memoize context value — only changes when actual state changes
     const value = useMemo<AuthContextType>(
          () => ({ userRole, setUserRole, isLoading, logout, user, setUser }),
          [userRole, setUserRole, isLoading, logout, user, setUser]
     );

     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
     const context = useContext(AuthContext);
     if (!context) throw new Error('useAuth must be used within an AuthProvider');
     return context;
};
