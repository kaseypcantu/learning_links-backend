import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { validate as validateUUID } from "uuid";

import { User } from "../../../../entity/User/User";

/* Check if Email is already in use */

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyInUseConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email: email } }).then(user => {
      return !user;
    });
  }
}

export function IsEmailAlreadyInUse(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyInUseConstraint
    });
  };
}

/* Check if Username is already in use */

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyInUseConstraint implements ValidatorConstraintInterface {
  validate(username: string): Promise<boolean> {
    return User.findOne({ where: { username: username } }).then(user => {
      return !user;
    });
  }
}

export function IsUsernameAlreadyInUse(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyInUseConstraint
    });
  };
}

/* Check if ShippingAddress exists */

// @ValidatorConstraint({ async: true })
// export class DoesAddressAlreadyExistConstraint implements ValidatorConstraintInterface {
//   validate(shipFromAddresses: ShipFromAddress): Promise<boolean> {
//     return User.findOne({ where: { shippingAddresses: shipFromAddresses } }).then(user => {
//       return !user;
//     });
//   }
// }
//
// export function DoesAddressAlreadyExist(validationOptions?: ValidationOptions) {
//   return function(object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: IsUsernameAlreadyInUseConstraint
//     });
//   };
// }


/* Check if UUID is valid exists */

@ValidatorConstraint({ async: true })
export class IsValidUUIDConstraint implements ValidatorConstraintInterface {
  validate(token: string): boolean {
    return validateUUID(token);
  }
}

export function IsValidUUID(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUUIDConstraint
    });
  };
}
