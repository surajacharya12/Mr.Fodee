// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

UserModel _$UserModelFromJson(Map<String, dynamic> json) {
  return _UserModel.fromJson(json);
}

/// @nodoc
mixin _$UserModel {
  String get id => throw _privateConstructorUsedError;
  String get username => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get role => throw _privateConstructorUsedError;
  String? get profilePictureUrl => throw _privateConstructorUsedError;
  String? get phoneNumber => throw _privateConstructorUsedError;

  /// Serializes this UserModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UserModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserModelCopyWith<UserModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserModelCopyWith<$Res> {
  factory $UserModelCopyWith(UserModel value, $Res Function(UserModel) then) =
      _$UserModelCopyWithImpl<$Res, UserModel>;
  @useResult
  $Res call({
    String id,
    String username,
    String email,
    String role,
    String? profilePictureUrl,
    String? phoneNumber,
  });
}

/// @nodoc
class _$UserModelCopyWithImpl<$Res, $Val extends UserModel>
    implements $UserModelCopyWith<$Res> {
  _$UserModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UserModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? username = null,
    Object? email = null,
    Object? role = null,
    Object? profilePictureUrl = freezed,
    Object? phoneNumber = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            username: null == username
                ? _value.username
                : username // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            role: null == role
                ? _value.role
                : role // ignore: cast_nullable_to_non_nullable
                      as String,
            profilePictureUrl: freezed == profilePictureUrl
                ? _value.profilePictureUrl
                : profilePictureUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            phoneNumber: freezed == phoneNumber
                ? _value.phoneNumber
                : phoneNumber // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$UserModelImplCopyWith<$Res>
    implements $UserModelCopyWith<$Res> {
  factory _$$UserModelImplCopyWith(
    _$UserModelImpl value,
    $Res Function(_$UserModelImpl) then,
  ) = __$$UserModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String username,
    String email,
    String role,
    String? profilePictureUrl,
    String? phoneNumber,
  });
}

/// @nodoc
class __$$UserModelImplCopyWithImpl<$Res>
    extends _$UserModelCopyWithImpl<$Res, _$UserModelImpl>
    implements _$$UserModelImplCopyWith<$Res> {
  __$$UserModelImplCopyWithImpl(
    _$UserModelImpl _value,
    $Res Function(_$UserModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UserModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? username = null,
    Object? email = null,
    Object? role = null,
    Object? profilePictureUrl = freezed,
    Object? phoneNumber = freezed,
  }) {
    return _then(
      _$UserModelImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        username: null == username
            ? _value.username
            : username // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        role: null == role
            ? _value.role
            : role // ignore: cast_nullable_to_non_nullable
                  as String,
        profilePictureUrl: freezed == profilePictureUrl
            ? _value.profilePictureUrl
            : profilePictureUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        phoneNumber: freezed == phoneNumber
            ? _value.phoneNumber
            : phoneNumber // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$UserModelImpl implements _UserModel {
  const _$UserModelImpl({
    required this.id,
    required this.username,
    required this.email,
    required this.role,
    this.profilePictureUrl,
    this.phoneNumber,
  });

  factory _$UserModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserModelImplFromJson(json);

  @override
  final String id;
  @override
  final String username;
  @override
  final String email;
  @override
  final String role;
  @override
  final String? profilePictureUrl;
  @override
  final String? phoneNumber;

  @override
  String toString() {
    return 'UserModel(id: $id, username: $username, email: $email, role: $role, profilePictureUrl: $profilePictureUrl, phoneNumber: $phoneNumber)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.username, username) ||
                other.username == username) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.profilePictureUrl, profilePictureUrl) ||
                other.profilePictureUrl == profilePictureUrl) &&
            (identical(other.phoneNumber, phoneNumber) ||
                other.phoneNumber == phoneNumber));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    username,
    email,
    role,
    profilePictureUrl,
    phoneNumber,
  );

  /// Create a copy of UserModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserModelImplCopyWith<_$UserModelImpl> get copyWith =>
      __$$UserModelImplCopyWithImpl<_$UserModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserModelImplToJson(this);
  }
}

abstract class _UserModel implements UserModel {
  const factory _UserModel({
    required final String id,
    required final String username,
    required final String email,
    required final String role,
    final String? profilePictureUrl,
    final String? phoneNumber,
  }) = _$UserModelImpl;

  factory _UserModel.fromJson(Map<String, dynamic> json) =
      _$UserModelImpl.fromJson;

  @override
  String get id;
  @override
  String get username;
  @override
  String get email;
  @override
  String get role;
  @override
  String? get profilePictureUrl;
  @override
  String? get phoneNumber;

  /// Create a copy of UserModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserModelImplCopyWith<_$UserModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RiderModel _$RiderModelFromJson(Map<String, dynamic> json) {
  return _RiderModel.fromJson(json);
}

/// @nodoc
mixin _$RiderModel {
  String get id => throw _privateConstructorUsedError;
  String get vehicleType => throw _privateConstructorUsedError;
  bool get isOnline => throw _privateConstructorUsedError;
  bool get isAvailable => throw _privateConstructorUsedError;
  double get walletBalance => throw _privateConstructorUsedError;
  int get totalDeliveries => throw _privateConstructorUsedError;
  double get rating => throw _privateConstructorUsedError;

  /// Serializes this RiderModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RiderModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RiderModelCopyWith<RiderModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RiderModelCopyWith<$Res> {
  factory $RiderModelCopyWith(
    RiderModel value,
    $Res Function(RiderModel) then,
  ) = _$RiderModelCopyWithImpl<$Res, RiderModel>;
  @useResult
  $Res call({
    String id,
    String vehicleType,
    bool isOnline,
    bool isAvailable,
    double walletBalance,
    int totalDeliveries,
    double rating,
  });
}

/// @nodoc
class _$RiderModelCopyWithImpl<$Res, $Val extends RiderModel>
    implements $RiderModelCopyWith<$Res> {
  _$RiderModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RiderModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? vehicleType = null,
    Object? isOnline = null,
    Object? isAvailable = null,
    Object? walletBalance = null,
    Object? totalDeliveries = null,
    Object? rating = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            vehicleType: null == vehicleType
                ? _value.vehicleType
                : vehicleType // ignore: cast_nullable_to_non_nullable
                      as String,
            isOnline: null == isOnline
                ? _value.isOnline
                : isOnline // ignore: cast_nullable_to_non_nullable
                      as bool,
            isAvailable: null == isAvailable
                ? _value.isAvailable
                : isAvailable // ignore: cast_nullable_to_non_nullable
                      as bool,
            walletBalance: null == walletBalance
                ? _value.walletBalance
                : walletBalance // ignore: cast_nullable_to_non_nullable
                      as double,
            totalDeliveries: null == totalDeliveries
                ? _value.totalDeliveries
                : totalDeliveries // ignore: cast_nullable_to_non_nullable
                      as int,
            rating: null == rating
                ? _value.rating
                : rating // ignore: cast_nullable_to_non_nullable
                      as double,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$RiderModelImplCopyWith<$Res>
    implements $RiderModelCopyWith<$Res> {
  factory _$$RiderModelImplCopyWith(
    _$RiderModelImpl value,
    $Res Function(_$RiderModelImpl) then,
  ) = __$$RiderModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String vehicleType,
    bool isOnline,
    bool isAvailable,
    double walletBalance,
    int totalDeliveries,
    double rating,
  });
}

/// @nodoc
class __$$RiderModelImplCopyWithImpl<$Res>
    extends _$RiderModelCopyWithImpl<$Res, _$RiderModelImpl>
    implements _$$RiderModelImplCopyWith<$Res> {
  __$$RiderModelImplCopyWithImpl(
    _$RiderModelImpl _value,
    $Res Function(_$RiderModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of RiderModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? vehicleType = null,
    Object? isOnline = null,
    Object? isAvailable = null,
    Object? walletBalance = null,
    Object? totalDeliveries = null,
    Object? rating = null,
  }) {
    return _then(
      _$RiderModelImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        vehicleType: null == vehicleType
            ? _value.vehicleType
            : vehicleType // ignore: cast_nullable_to_non_nullable
                  as String,
        isOnline: null == isOnline
            ? _value.isOnline
            : isOnline // ignore: cast_nullable_to_non_nullable
                  as bool,
        isAvailable: null == isAvailable
            ? _value.isAvailable
            : isAvailable // ignore: cast_nullable_to_non_nullable
                  as bool,
        walletBalance: null == walletBalance
            ? _value.walletBalance
            : walletBalance // ignore: cast_nullable_to_non_nullable
                  as double,
        totalDeliveries: null == totalDeliveries
            ? _value.totalDeliveries
            : totalDeliveries // ignore: cast_nullable_to_non_nullable
                  as int,
        rating: null == rating
            ? _value.rating
            : rating // ignore: cast_nullable_to_non_nullable
                  as double,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RiderModelImpl implements _RiderModel {
  const _$RiderModelImpl({
    required this.id,
    required this.vehicleType,
    this.isOnline = false,
    this.isAvailable = true,
    this.walletBalance = 0.0,
    this.totalDeliveries = 0,
    this.rating = 5.0,
  });

  factory _$RiderModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$RiderModelImplFromJson(json);

  @override
  final String id;
  @override
  final String vehicleType;
  @override
  @JsonKey()
  final bool isOnline;
  @override
  @JsonKey()
  final bool isAvailable;
  @override
  @JsonKey()
  final double walletBalance;
  @override
  @JsonKey()
  final int totalDeliveries;
  @override
  @JsonKey()
  final double rating;

  @override
  String toString() {
    return 'RiderModel(id: $id, vehicleType: $vehicleType, isOnline: $isOnline, isAvailable: $isAvailable, walletBalance: $walletBalance, totalDeliveries: $totalDeliveries, rating: $rating)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RiderModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.vehicleType, vehicleType) ||
                other.vehicleType == vehicleType) &&
            (identical(other.isOnline, isOnline) ||
                other.isOnline == isOnline) &&
            (identical(other.isAvailable, isAvailable) ||
                other.isAvailable == isAvailable) &&
            (identical(other.walletBalance, walletBalance) ||
                other.walletBalance == walletBalance) &&
            (identical(other.totalDeliveries, totalDeliveries) ||
                other.totalDeliveries == totalDeliveries) &&
            (identical(other.rating, rating) || other.rating == rating));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    vehicleType,
    isOnline,
    isAvailable,
    walletBalance,
    totalDeliveries,
    rating,
  );

  /// Create a copy of RiderModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RiderModelImplCopyWith<_$RiderModelImpl> get copyWith =>
      __$$RiderModelImplCopyWithImpl<_$RiderModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RiderModelImplToJson(this);
  }
}

abstract class _RiderModel implements RiderModel {
  const factory _RiderModel({
    required final String id,
    required final String vehicleType,
    final bool isOnline,
    final bool isAvailable,
    final double walletBalance,
    final int totalDeliveries,
    final double rating,
  }) = _$RiderModelImpl;

  factory _RiderModel.fromJson(Map<String, dynamic> json) =
      _$RiderModelImpl.fromJson;

  @override
  String get id;
  @override
  String get vehicleType;
  @override
  bool get isOnline;
  @override
  bool get isAvailable;
  @override
  double get walletBalance;
  @override
  int get totalDeliveries;
  @override
  double get rating;

  /// Create a copy of RiderModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RiderModelImplCopyWith<_$RiderModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
