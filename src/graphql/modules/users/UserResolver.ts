import util from "util";
import { User } from "../../../entity/User/User";
import { Query, Resolver, Arg, Ctx, Authorized, Mutation } from "type-graphql";
import { PlatformContext } from "../../../types/graphql-utils";
import { getRepository } from "typeorm";

@Resolver(User)
export class UserResolver {
  // @Authorized()
  @Query(returns => [User])
  async allUsers(): Promise<User[] | string> {
    const users = await User.find();
    if (!users) {
      return "No users in the DB yet!";
    }
    console.log(`All Users: ${users}`);
    return users;
  }

  @Query(returns => User, { nullable: true })
  async whoAmI(@Ctx() ctx: PlatformContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      console.log("Oops, you are not authenticated. Please login, and try again.");
      return undefined;
    }

    return User.findOne(ctx.req.session!.userId);
  }

  // @Authorized()
  // @Mutation(() => User)
  // async addShipFromAddress(
  //   @Ctx() ctx: PlatformContext,
  //   @Arg("shipFromAddress") {
  //     name,
  //     phone_number,
  //     company_name,
  //     address_line1,
  //     address_line2,
  //     address_line3,
  //     city_locality,
  //     state_province,
  //     postal_code,
  //     country_code,
  //     address_residential_indicator,
  //     nickname
  //   }: AddShipFromAddressInput
  // ): Promise<User | undefined> {
  //   const cookie = ctx.req.session!.userId;
  //   if (!cookie) {
  //     return undefined;
  //   }
  //   const userRepo = getRepository(User);
  //
  //   const newAddress = new ShipFromAddress();
  //
  //   newAddress.name = name;
  //   newAddress.phoneNumber = phone_number;
  //   newAddress.companyName = company_name;
  //   newAddress.addressLine1 = address_line1;
  //   newAddress.addressLine2 = address_line2;
  //   newAddress.addressLine3 = address_line3;
  //   newAddress.cityLocality = city_locality;
  //   newAddress.stateProvince = state_province;
  //   newAddress.postalCode = postal_code;
  //   newAddress.countryCode = country_code;
  //   newAddress.addressResidentialIndicator = address_residential_indicator;
  //   newAddress.nickname = nickname;
  //
  //   await userRepo.findOne({ where: { userId: cookie } })
  //     .then(async () => {
  //       await userRepo.update({ userId: cookie }, {
  //         lastName: "ADDED SHIP FROM ADDRESS",
  //         shippingAddresses: [newAddress]
  //       });
  //     });
  //
  //   const currentUser = await userRepo.findOne({ where: { userId: cookie } });
  //   console.log(`CURRENT USER: ${util.inspect(currentUser, true, 8, true)}`);
  //
  //   return currentUser;
  // }
}

