import Joi from 'joi';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const validationErrors = error.details.map((detail) => detail.message);

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors,
    });
  }

  // 🚀 If no error, move to the next middleware/controller
  next();
};

const registerSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .trim()
    .messages({
      'string.min': 'Full name must be at least 3 characters long',
      'string.max': 'Full name cannot be more than 50 characters long',
      'any.required': 'Full name is required',
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .trim()
    .max(30)
    .messages({
      'string.email': 'Invalid email format',
      'string.max': 'Email cannot be more than 30 characters long',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'
      )
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*), and be at least 8 characters long.',
      'any.required': 'Password is required',
    }),

  role: Joi.string()
    .valid('user', 'admin')
    .messages({
      'any.only': 'Role must be either user or admin',
      'any.required': 'Role is required',
    }),
});

const validateRegister = validate(registerSchema);
export default validateRegister;
