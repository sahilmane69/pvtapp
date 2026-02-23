import React, { useEffect, useRef, useState } from 'react';
import {
     Animated,
     View,
     Text,
     TouchableOpacity,
     TouchableWithoutFeedback,
     Dimensions,
     Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useDrawer } from '../context/DrawerContext';
import {
     LayoutDashboard,
     ClipboardList,
     KeyRound,
     MapPin,
     LogOut,
     User as UserIcon,
     X,
     ChevronRight,
     Sprout,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.78;

// ── Drawer nav items ──────────────────────────────────────────────
const NAV_ITEMS = [
     { id: 'Dashboard', label: 'My Dashboard', icon: LayoutDashboard, tab: 'Dashboard' as string | null },
     { id: 'Orders', label: 'My Orders', icon: ClipboardList, tab: 'Orders' as string | null },
     { id: 'Address', label: 'My Address', icon: MapPin, tab: null },
     { id: 'Password', label: 'Change Password', icon: KeyRound, tab: null },
];

interface CustomerDrawerProps {
     navigation: any;
     activeRouteName?: string;
}

export const CustomerDrawer = ({ navigation, activeRouteName = '' }: CustomerDrawerProps) => {
     const { isOpen, closeDrawer } = useDrawer();
     const { user, logout } = useAuth();
     const insets = useSafeAreaInsets();

     // Controls whether the component is mounted at all
     const [visible, setVisible] = useState(false);

     const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
     const backdropAnim = useRef(new Animated.Value(0)).current;

     useEffect(() => {
          if (isOpen) {
               setVisible(true); // mount first, then animate in
               Animated.parallel([
                    Animated.spring(slideAnim, {
                         toValue: 0,
                         useNativeDriver: true,
                         damping: 22,
                         stiffness: 200,
                         mass: 0.8,
                    }),
                    Animated.timing(backdropAnim, {
                         toValue: 1,
                         duration: 250,
                         useNativeDriver: true,
                    }),
               ]).start();
          } else {
               // Animate out, then unmount
               Animated.parallel([
                    Animated.spring(slideAnim, {
                         toValue: -DRAWER_WIDTH,
                         useNativeDriver: true,
                         damping: 22,
                         stiffness: 200,
                         mass: 0.8,
                    }),
                    Animated.timing(backdropAnim, {
                         toValue: 0,
                         duration: 200,
                         useNativeDriver: true,
                    }),
               ]).start(() => setVisible(false));
          }
     }, [isOpen]);

     const handleNavItem = (item: typeof NAV_ITEMS[0]) => {
          closeDrawer();
          if (item.tab) {
               setTimeout(() => navigation.navigate(item.tab!), 220);
          } else if (item.id === 'Address') {
               setTimeout(() => Alert.alert('Coming Soon', 'Address management is coming soon!'), 220);
          } else if (item.id === 'Password') {
               setTimeout(() => Alert.alert('Coming Soon', 'Change Password feature is coming soon!'), 220);
          }
     };

     const handleLogout = () => {
          closeDrawer();
          setTimeout(() => {
               Alert.alert(
                    'Logout',
                    'Are you sure you want to log out?',
                    [
                         { text: 'Cancel', style: 'cancel' },
                         { text: 'Logout', style: 'destructive', onPress: () => logout() },
                    ]
               );
          }, 250);
     };

     // Don't render anything when not needed
     if (!visible) return null;

     return (
          <View
               style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 9999,
                    elevation: 9999,
               }}
               pointerEvents={isOpen ? 'auto' : 'none'}
          >
               {/* ── Backdrop ────────────────────────────────────────── */}
               <TouchableWithoutFeedback onPress={closeDrawer}>
                    <Animated.View
                         style={{
                              position: 'absolute',
                              top: 0, left: 0, right: 0, bottom: 0,
                              backgroundColor: 'rgba(0,0,0,0.55)',
                              opacity: backdropAnim,
                         }}
                    />
               </TouchableWithoutFeedback>

               {/* ── Drawer panel ────────────────────────────────────── */}
               <Animated.View
                    style={{
                         position: 'absolute',
                         top: 0, left: 0, bottom: 0,
                         width: DRAWER_WIDTH,
                         transform: [{ translateX: slideAnim }],
                         backgroundColor: '#fff',
                         shadowColor: '#000',
                         shadowOffset: { width: 8, height: 0 },
                         shadowOpacity: 0.2,
                         shadowRadius: 24,
                         elevation: 24,
                         borderTopRightRadius: 32,
                         borderBottomRightRadius: 32,
                         overflow: 'hidden',
                    }}
               >
                    {/* ── Green hero header ─────────────────────────────── */}
                    <View
                         style={{
                              backgroundColor: '#006B44',
                              paddingTop: insets.top + 20,
                              paddingBottom: 28,
                              paddingHorizontal: 24,
                         }}
                    >
                         {/* Close button */}
                         <TouchableOpacity
                              onPress={closeDrawer}
                              style={{
                                   alignSelf: 'flex-end',
                                   backgroundColor: 'rgba(255,255,255,0.15)',
                                   padding: 8,
                                   borderRadius: 14,
                                   marginBottom: 20,
                              }}
                         >
                              <X size={18} color="#fff" />
                         </TouchableOpacity>

                         {/* Avatar (default icon, per user request) */}
                         <View
                              style={{
                                   width: 68, height: 68,
                                   borderRadius: 24,
                                   backgroundColor: 'rgba(255,255,255,0.15)',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   borderWidth: 2,
                                   borderColor: 'rgba(255,255,255,0.3)',
                                   marginBottom: 14,
                              }}
                         >
                              <UserIcon size={34} color="#fff" />
                         </View>

                         {/* Username + role badge */}
                         <Text style={{
                              color: '#fff', fontSize: 20, fontWeight: '900',
                              fontStyle: 'italic', letterSpacing: -0.5,
                         }}>
                              {user?.username ? `@${user.username}` : 'Guest User'}
                         </Text>
                         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                              <View style={{
                                   width: 7, height: 7, borderRadius: 4,
                                   backgroundColor: '#4ADE80', marginRight: 6,
                              }} />
                              <Text style={{
                                   color: 'rgba(255,255,255,0.7)', fontSize: 11,
                                   fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase',
                              }}>
                                   Customer
                              </Text>
                         </View>
                    </View>

                    {/* ── Brand strip ───────────────────────────────────── */}
                    <View style={{
                         paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4,
                         flexDirection: 'row', alignItems: 'center',
                    }}>
                         <Sprout size={14} color="#006B44" />
                         <Text style={{
                              color: '#006B44', fontSize: 11, fontWeight: '900',
                              letterSpacing: 1.5, textTransform: 'uppercase', marginLeft: 6,
                         }}>
                              FarminGo
                         </Text>
                    </View>

                    {/* ── Nav items ─────────────────────────────────────── */}
                    <View style={{ flex: 1, paddingTop: 8, paddingHorizontal: 12 }}>
                         {NAV_ITEMS.map((item) => {
                              const Icon = item.icon;
                              const isActive = item.tab !== null && item.tab === activeRouteName;
                              return (
                                   <TouchableOpacity
                                        key={item.id}
                                        onPress={() => handleNavItem(item)}
                                        activeOpacity={0.7}
                                        style={{
                                             flexDirection: 'row',
                                             alignItems: 'center',
                                             paddingVertical: 14,
                                             paddingHorizontal: 16,
                                             borderRadius: 20,
                                             marginBottom: 4,
                                             backgroundColor: isActive ? '#E8F5EE' : 'transparent',
                                        }}
                                   >
                                        <View style={{
                                             width: 42, height: 42, borderRadius: 14,
                                             alignItems: 'center', justifyContent: 'center',
                                             backgroundColor: isActive ? '#006B44' : '#F1F5F9',
                                             marginRight: 14,
                                        }}>
                                             <Icon size={20} color={isActive ? '#fff' : '#64748B'} />
                                        </View>
                                        <Text style={{
                                             flex: 1, fontSize: 15, fontWeight: '800',
                                             color: isActive ? '#006B44' : '#334155',
                                             letterSpacing: -0.2,
                                        }}>
                                             {item.label}
                                        </Text>
                                        {isActive ? (
                                             <View style={{
                                                  width: 6, height: 24, borderRadius: 3,
                                                  backgroundColor: '#006B44',
                                             }} />
                                        ) : (
                                             <ChevronRight size={16} color="#CBD5E1" />
                                        )}
                                   </TouchableOpacity>
                              );
                         })}
                    </View>

                    {/* ── Divider ───────────────────────────────────────── */}
                    <View style={{
                         height: 1, backgroundColor: '#F1F5F9',
                         marginHorizontal: 24, marginBottom: 12,
                    }} />

                    {/* ── Logout ────────────────────────────────────────── */}
                    <TouchableOpacity
                         onPress={handleLogout}
                         activeOpacity={0.7}
                         style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginHorizontal: 12,
                              paddingVertical: 14,
                              paddingHorizontal: 16,
                              borderRadius: 20,
                              backgroundColor: '#FFF1F2',
                              marginBottom: insets.bottom + 24,
                         }}
                    >
                         <View style={{
                              width: 42, height: 42, borderRadius: 14,
                              backgroundColor: '#FECDD3',
                              alignItems: 'center', justifyContent: 'center',
                              marginRight: 14,
                         }}>
                              <LogOut size={20} color="#E11D48" />
                         </View>
                         <Text style={{
                              flex: 1, fontSize: 15, fontWeight: '800',
                              color: '#E11D48', letterSpacing: -0.2,
                         }}>
                              Logout
                         </Text>
                    </TouchableOpacity>
               </Animated.View>
          </View>
     );
};
