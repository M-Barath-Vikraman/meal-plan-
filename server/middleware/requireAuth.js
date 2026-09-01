import { CognitoJwtVerifier } from 'aws-jwt-verify';

const userPoolId = process.env.VITE_COGNITO_USER_POOL_ID || 'ap-south-1_h5wK04j2m';
const clientId = process.env.VITE_COGNITO_CLIENT_ID || '7ngr1t1fddt1pr8i0tf8tk506i';

// Create Cognito JWT Verifier for Access Tokens
let verifier = null;
try {
  verifier = CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: 'access',
    clientId,
  });
} catch (err) {
  console.error('[CognitoJwtVerifier Init Error]:', err);
}

/**
 * Express middleware to verify AWS Cognito Access Tokens in Authorization header.
 */
export default async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authorization header missing or invalid. Expected: Bearer <access_token>',
          code: 'UNAUTHORIZED',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const token = authHeader.substring(7);

    if (!verifier) {
      verifier = CognitoJwtVerifier.create({
        userPoolId,
        tokenUse: 'access',
        clientId,
      });
    }

    const payload = await verifier.verify(token);

    // Attach verified user payload to request
    req.user = {
      sub: payload.sub,
      username: payload.username,
      client_id: payload.client_id,
      scope: payload.scope,
      exp: payload.exp,
      token_use: payload.token_use,
    };

    next();
  } catch (err) {
    console.warn('[requireAuth] Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired authentication token',
        code: 'UNAUTHORIZED',
        details: err.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
