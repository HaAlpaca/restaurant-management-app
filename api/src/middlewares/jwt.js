import { expressjwt } from "express-jwt";
import jwks from "jwks-rsa";
import { env } from "../config/environment.js";

export const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: env.jwksUri,
  }),
  audience: env.audience,
  issuer: env.issuer,
  algorithms: ["RS256"],
});
