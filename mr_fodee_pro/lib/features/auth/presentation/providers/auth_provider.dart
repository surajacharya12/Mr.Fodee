import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/models/user_model.dart';
import '../../../../core/constants/api_constants.dart';

final apiClientProvider = Provider((ref) => ApiClient());

class AuthState {
  final UserModel? user;
  final RiderModel? rider;
  final bool isLoading;
  final String? error;

  AuthState({this.user, this.rider, this.isLoading = false, this.error});

  AuthState copyWith({
    UserModel? user,
    RiderModel? rider,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      rider: rider ?? this.rider,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiClient _apiClient;

  AuthNotifier(this._apiClient) : super(AuthState());

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.riderLogin,
        data: {'email': email, 'password': password},
      );

      final user = UserModel.fromJson(response.data['user']);
      final rider = RiderModel.fromJson(response.data['rider']);
      final token = response.data['token'];

      await _apiClient.saveToken(token);
      state = state.copyWith(user: user, rider: rider, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> register(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.dio.post(
        ApiConstants.riderRegister,
        data: data,
      );

      final user = UserModel.fromJson(response.data['user']);
      final rider = RiderModel.fromJson(response.data['rider']);
      final token = response.data['token'];

      await _apiClient.saveToken(token);
      state = state.copyWith(user: user, rider: rider, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void logout() async {
    await _apiClient.deleteToken();
    state = AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(apiClientProvider));
});
