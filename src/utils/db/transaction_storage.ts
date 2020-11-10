import { createNamespace } from "continuation-local-storage";
import { v4, v5 } from "uuid";

// TODO: create clstorage funcs
export const namespace = createNamespace("transaction_store");

export function setTransactionId(id?: string | undefined): string {
  // logger.info(namespace.set("transactionId", id ?? v4()));
  return namespace.set("transactionId", id ?? v4());
}

export function getTransactionId(): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  // logger.info(trId);
  return namespace.get("transactionId") ?? "no_transaction_id";
}

export function generateV4_UUID() {
  return namespace.run(gen => {
    namespace.set("transactionId", v4());
  });
}

export class V5_UUID {
  #v5namespace = "7f86a2aa-11cb-5919-b025-106b5bc1e925"

  generate(): string {
    return v5(v4(), this.#v5namespace); // TODO: pick up here finish this class and ctor
  }
}

