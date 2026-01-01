package com.phongdnh.se121.constants;

/**
 * Constants for error messages used across the application.
 * Grouped by category for better organization.
 */
public interface ErrorMessageConstants {

  // ======================== VALIDATION - General ========================
  String VALIDATION_INVALID_EMAIL_OR_PHONE = "Invalid email or phone number";
  String VALIDATION_INVALID_PHONE_NUMBER = "Invalid phone number";
  String VALIDATION_INVALID_CURRENT_PASSWORD = "Invalid current password";
  String VALIDATION_CODE_ALREADY_EXISTS = "Code already exists";
  String VALIDATION_ALREADY_EXISTS = "Already exists";
  String VALIDATION_ONE_OR_MORE_ATTACHMENTS_INVALID = "One or more attachments are invalid";

  // ======================== VALIDATION - Property ========================
  String VALIDATION_INVALID_PROPERTY_TYPE = "Invalid property type";
  String VALIDATION_INVALID_PROVINCE = "Invalid province";
  String VALIDATION_INVALID_WARD = "Invalid ward";
  String VALIDATION_INVALID_THUMBNAIL_FILE = "Invalid thumbnail file";
  String VALIDATION_PROVINCE_DOES_NOT_EXIST = "Province does not exist";
  String VALIDATION_WARD_CODE_ALREADY_EXISTS = "Ward code already exists";

  // ======================== VALIDATION - Conversation ========================
  String VALIDATION_CONVERSATION_NOT_PENDING = "Conversation is not in PENDING state";
  String VALIDATION_CONVERSATION_NOT_OPEN = "Conversation is not in OPEN state";

  // ======================== AUTH - User ========================
  String AUTH_EMAIL_ALREADY_TAKEN = "Email is already taken";
  String AUTH_PHONE_ALREADY_TAKEN = "Phone is already taken";
  String AUTH_EMAIL_ALREADY_IN_USE = "Email is already in use";
  String AUTH_PHONE_ALREADY_IN_USE = "Phone number is already in use";
  String AUTH_USER_CONTACT_ALREADY_EXISTS = "User with this contact already exists";
  String AUTH_PHONE_NOT_VERIFIED = "Phone is not verified";
  String AUTH_USER_MUST_BE_LOGGED_IN = "User must be logged in";

  // ======================== AUTH - Role/Permission ========================
  String AUTH_ROLE_NOT_FOUND = "Role not found";
  String AUTH_CANNOT_DELETE_ADMIN_ROLE = "Cannot delete the administrator role";
  String AUTH_SOME_PERMISSIONS_NOT_FOUND = "Some permissions are not found";
  String AUTH_PERMISSION_ALREADY_EXISTS = "Permission with the same method and url already exists";

  // ======================== AUTH - Participant ========================
  String AUTH_USER_ALREADY_PARTICIPANT = "User is already a participant in this conversation";
  String AUTH_USER_NOT_PARTICIPANT = "User is not a participant in this conversation";
  String AUTH_USER_NOT_SENDER = "User is not the sender of this message";
  String AUTH_USER_NOT_CHAT_PARTICIPANT = "User is not a participant of the chat";

  // ======================== RESOURCE - Not Found ========================
  String RESOURCE_AVATAR_NOT_FOUND = "Avatar not found";
  String RESOURCE_PROPERTY_NOT_FOUND = "Property not found";
  String RESOURCE_THUMBNAIL_FILE_NOT_FOUND = "Thumbnail file not found";
  String RESOURCE_USER_NOT_FOUND = "User not found";

  // ======================== RESOURCE - Already In Use ========================
  String RESOURCE_AVATAR_ALREADY_IN_USE = "Avatar is already in use";

  // ======================== FILE ========================
  String FILE_NOT_AVAILABLE_FOR_DOWNLOAD = "File is not available for download";
  String FILE_FAILED_TO_SIGN_IMGPROXY_URL = "Failed to sign imgproxy URL";

  // ======================== SYSTEM - Internal ========================
  String SYSTEM_FAILED_TO_PARSE_AI_RESPONSE = "Failed to parse metadata from AI response";
  String SYSTEM_FAILED_TO_SEND_EMAIL = "Failed to send email";
  String SYSTEM_ERROR_CREATING_BUCKET = "Error while creating bucket: ";
  String SYSTEM_HS512_SECRET_KEY_TOO_SHORT = "HS512 requires secret key >= 512 bits (64 bytes)";
  String SYSTEM_INVALID_USER_ID_IN_JWT = "Invalid user ID in JWT subject";
  String SYSTEM_UNSUPPORTED_CONTACT_TYPE = "Unsupported contact type";
  String SYSTEM_UNSUPPORTED_VERIFICATION_PURPOSE = "Unsupported verification purpose";
}

