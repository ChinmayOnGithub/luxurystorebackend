import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';


const ACCESS_TOKEN_SECRET = 'your-access-token-secret'; // Secret for signing tokens

// Middleware to validate access token
const authenticateToken = (req, res, next) => {
  // Get the token from cookies
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(403).send('Unauthorized');
  }

  // Verify the token
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Differentiating between expired and invalid tokens
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send('Token has expired');
      }
      return res.status(403).send('Invalid access token');
    }

    // Add the decoded user info to the request object for use in next middleware/route
    req.user = decoded; // Store decoded user info (email, role, etc.)
    next(); // Proceed to the next middleware or route handler
  });
};

export { authenticateToken };
