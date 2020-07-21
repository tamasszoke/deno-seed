import {
  nullable,
  isBool,
  isDate,
  isString,
  lengthBetween,
} from "../../deps.ts";

const schema = {
  username: [
    isString,
    lengthBetween(5, 100),
  ],
  name: [
    isString,
    lengthBetween(5, 100),
  ],
  email: [
    isString,
    lengthBetween(5, 100),
  ],
  password: [
    isString,
    lengthBetween(5, 1000),
  ],
  salt: [
    isString,
    lengthBetween(5, 100),
  ],
  active: [
    isBool,
  ],
  admin: [
    isBool,
  ],
  activationHash: [
    nullable,
    isString,
    lengthBetween(10, 1000),
  ],
  recoveryHash: [
    nullable,
    isString,
    lengthBetween(10, 1000),
  ],
  age: [
    isString,
    lengthBetween(3, 5),
  ],
  location: [
    isString,
    lengthBetween(3, 100),
  ],
  website: [
    isString,
  ],
  created_at: [
    isDate,
  ],
  updated_at: [
    isDate,
  ],
};

export default schema;
