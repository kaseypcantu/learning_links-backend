import { Request, Response } from "express";
import { namespace, setTransactionId } from "../utils/db/transaction_storage";

const appendTransactionId = (req: Request, res: Response) => {
  let id;
  const headers = req.headers["transaction_id"];
  if (headers && typeof headers === "string") {
    id = headers;
  }
  const txId = setTransactionId(id);
  res.setHeader("transaction_id", txId);
}

export default function LoggingMiddleware(
  req: Request,
  res: Response,
  next: Function
) {
  namespace.run(() => {
    appendTransactionId(req, res);
    next();
  });
}
