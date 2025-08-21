/**
 * Sends a server error response (500)
 * @param {Object} res - Express response object
 * @param {string|Error} error - Error message or Error object
 * @returns {Object} JSON response
 */
const ServerError = (res, error) => {
  return res.status(500).json({
    status: false,
    message: 'Internal Server Error!',
    error: error.message || error,
  });
};

/**
 * Sends a validation error response (400)
 * @param {Object} res - Express response object
 * @param {Object|Array} errors - Validation errors
 * @returns {Object} JSON response
 */
const ValidationErrorResponse = (res, errors) => {
  return res.status(400).json({
    status: false,
    message: 'Validation failed!',
    errors: errors.array ? errors.array() : errors,
  });
};

/**
 * Sends a client error response (400)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
const ClientError = (res, message) => {
  return res.status(400).json({
    status: false,
    message,
  });
};

/**
 * Sends an unauthorized error response (401)
 * @param {Object} res - Express response object
 * @param {string} [message='Unauthorized!'] - Error message
 * @returns {Object} JSON response
 */
const AuthError = (res, message = 'Unauthorized!') => {
  return res.status(401).json({
    status: false,
    message,
  });
};

/**
 * Sends a resource not found response (404)
 * @param {Object} res - Express response object
 * @param {string} [resource='Resource'] - Name of the resource
 * @returns {Object} JSON response
 */
const ResourceNotFound = (res, resource = 'Resource') => {
  return res.status(404).json({
    status: false,
    message: `${resource} not found!`,
  });
};

/**
 * Sends a success response (200)
 * @param {Object} res - Express response object
 * @param {string} [message='Success'] - Success message
 * @param {Object|Array} [data=null] - Optional data
 * @returns {Object} JSON response
 */
const SuccessResponse = (res, message = 'Success', data = null) => {
  const response = {
    status: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(200).json(response);
};

/**
 * Sends a created response (201)
 * @param {Object} res - Express response object
 * @param {string} [message='Resource created successfully'] - Success message
 * @param {Object|Array} [data=null] - Optional data
 * @returns {Object} JSON response
 */
const CreatedResponse = (res, message = 'Resource created successfully', data = null) => {
  const response = {
    status: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(201).json(response);
};

/**
 * Sends a no content response (204)
 * @param {Object} res - Express response object
 * @param {string} [message='No content'] - Success message
 * @returns {Object} JSON response
 */
const NoContentResponse = (res, message = 'No content') => {
  return res.status(204).json({
    status: true,
    message
  });
};

export {
  ServerError,
  ValidationErrorResponse,
  ClientError,
  AuthError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse,
  NoContentResponse
};