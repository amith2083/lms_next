import { ObjectId } from "mongoose";
import { Buffer } from "buffer";

export const sanitizeData=(data: any): any=> {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value instanceof ObjectId) {
        return value.toString();
      }
      if (Buffer.isBuffer(value)) {
        return value.toString("base64");
      }
      return value;
    })
  );
}
