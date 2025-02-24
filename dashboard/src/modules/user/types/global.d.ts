import { Express } from "express-serve-static-core";
import { UserRole } from "../../../utils/roles";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SMTP_SERVER: string;
      SMTP_USER: string;
      SMTP_KEY: string;
      SMTP_SENDER: string;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
// export {};
