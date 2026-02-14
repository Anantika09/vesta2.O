// backend/config/env.js - Environment Configuration with Validation
require('dotenv').config();
const Joi = require('joi');

// Define schema for environment validation
const envSchema = Joi.object({
  // Required
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(5000),
  
  // Database
  MONGO_URI: Joi.string().required().uri(),
  
  // JWT
  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  
  // Frontend
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  
  // Optional with defaults
  MONGO_POOL_SIZE: Joi.number().default(10),
  BCRYPT_SALT_ROUNDS: Joi.number().default(12),
  MAX_FILE_UPLOAD_SIZE: Joi.number().default(10485760),
}).unknown(); // Allow unknown variables

// Validate environment
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

module.exports = {
  // Environment
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  isProduction: envVars.NODE_ENV === 'production',
  isDevelopment: envVars.NODE_ENV === 'development',
  
  // Database
  mongo: {
    uri: envVars.MONGO_URI,
    options: {
      maxPoolSize: parseInt(envVars.MONGO_POOL_SIZE),
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    },
  },
  
  // JWT
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    cookieExpiresIn: parseInt(envVars.JWT_COOKIE_EXPIRES_IN) || 7,
  },
  
  // Cloudinary
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
    folder: 'vesta',
    uploadPreset: 'vesta_uploads',
  },
  
  // Security
  security: {
    bcryptSaltRounds: parseInt(envVars.BCRYPT_SALT_ROUNDS),
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: 100,
  },
  
  // CORS
  cors: {
    origin: envVars.CORS_ORIGIN.split(',').map(origin => origin.trim()),
    credentials: true,
  },
  
  // File upload
  upload: {
    maxFileSize: parseInt(envVars.MAX_FILE_UPLOAD_SIZE),
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedImageExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  
  // API
  api: {
    prefix: '/api/v1',
    version: '1.0.0',
  },
  
  // URLs
  urls: {
    frontend: envVars.FRONTEND_URL,
    backend: `http://localhost:${envVars.PORT}`,
  },
};