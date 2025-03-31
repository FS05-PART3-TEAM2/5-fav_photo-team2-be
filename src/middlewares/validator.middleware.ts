import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";
import { formatZodError } from "../utils/formatZodError";

type Schemas = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

export const validateAll =
  (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        const flat = result.error.flatten();
        throw new ValidationError(formatZodError(flat));
      }
      req.body = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        const flat = result.error.flatten();
        throw new ValidationError(formatZodError(flat));
      }
      req.query = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        const flat = result.error.flatten();
        throw new ValidationError(formatZodError(flat));
      }
      req.params = result.data;
    }

    next();
  };
