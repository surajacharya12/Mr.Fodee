import 'package:socket_io_client/socket_io_client.dart' as io;
import '../constants/api_constants.dart';

class SocketService {
  late io.Socket _socket;

  void connect(String userId) {
    _socket = io.io(ApiConstants.socketUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    _socket.connect();

    _socket.onConnect((_) {
      print('Connected to socket');
      _socket.emit('join', userId);
    });

    _socket.onDisconnect((_) => print('Disconnected from socket'));
  }

  void onNewOrder(Function(Map<String, dynamic>) callback) {
    _socket.on('newOrder', (data) => callback(data));
  }

  void updateLocation(String riderId, double lat, double lng) {
    _socket.emit('updateLocation', {
      'riderId': riderId,
      'latitude': lat,
      'longitude': lng,
    });
  }

  void dispose() {
    _socket.dispose();
  }
}
