// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserModelImpl _$$UserModelImplFromJson(Map<String, dynamic> json) =>
    _$UserModelImpl(
      id: json['id'] as String,
      username: json['username'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      profilePictureUrl: json['profilePictureUrl'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
    );

Map<String, dynamic> _$$UserModelImplToJson(_$UserModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'username': instance.username,
      'email': instance.email,
      'role': instance.role,
      'profilePictureUrl': instance.profilePictureUrl,
      'phoneNumber': instance.phoneNumber,
    };

_$RiderModelImpl _$$RiderModelImplFromJson(Map<String, dynamic> json) =>
    _$RiderModelImpl(
      id: json['id'] as String,
      vehicleType: json['vehicleType'] as String,
      isOnline: json['isOnline'] as bool? ?? false,
      isAvailable: json['isAvailable'] as bool? ?? true,
      walletBalance: (json['walletBalance'] as num?)?.toDouble() ?? 0.0,
      totalDeliveries: (json['totalDeliveries'] as num?)?.toInt() ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
    );

Map<String, dynamic> _$$RiderModelImplToJson(_$RiderModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'vehicleType': instance.vehicleType,
      'isOnline': instance.isOnline,
      'isAvailable': instance.isAvailable,
      'walletBalance': instance.walletBalance,
      'totalDeliveries': instance.totalDeliveries,
      'rating': instance.rating,
    };
