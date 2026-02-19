export type RootStackParamList = {
  Auth: undefined;
  FarmerFlow: undefined;
  DeliveryFlow: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: { role: 'FARMER' | 'DELIVERY' };
};

export type FarmerStackParamList = {
  Dashboard: undefined;
  AddProduct: undefined;
  Orders: undefined;
};

export type DeliveryStackParamList = {
  TaskList: undefined;
  RouteMap: { orderId: string };
  DeliveryHistory: undefined;
};
