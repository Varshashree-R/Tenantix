import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../request-errors/index.js";

// Authenticate Owner User using JWT Token
const authorizeOwnerUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthorizedError("User is not Authorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_OWNER);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new UnAuthorizedError("Access Token is not valid");
  }
};

// Authenticate Tenant User using JWT Token
const authorizeTenantUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthorizedError("User is not Authorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_TENANT);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new UnAuthorizedError("Access Token is not valid");
  }
};

export { authorizeOwnerUser, authorizeTenantUser };
