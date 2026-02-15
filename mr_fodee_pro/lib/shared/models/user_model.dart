import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String username,
    required String email,
    required String role,
    String? profilePictureUrl,
    String? phoneNumber,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

@freezed
class RiderModel with _$RiderModel {
  const factory RiderModel({
    required String id,
    required String vehicleType,
    @Default(false) bool isOnline,
    @Default(true) bool isAvailable,
    @Default(0.0) double walletBalance,
    @Default(0) int totalDeliveries,
    @Default(5.0) double rating,
  }) = _RiderModel;

  factory RiderModel.fromJson(Map<String, dynamic> json) =>
      _$RiderModelFromJson(json);
}
