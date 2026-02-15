class ApiConstants {
  static const String baseUrl = 'http://localhost:3001'; // Update for production
  static const String socketUrl = 'http://localhost:3001';
  
  // Auth
  static const String riderRegister = '/rider/register';
  static const String riderLogin = '/rider/login';
  
  // Rider profile & status
  static const String updateStatus = '/rider/status';
  static const String updateLocation = '/rider/location';
  
  // Orders
  static const String assignedOrders = '/rider/orders';
  static const String acceptOrder = '/rider/orders/accept';
  static const String updateOrderStatus = '/rider/orders/status';
}
