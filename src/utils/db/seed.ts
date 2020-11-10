import util from "util";

import { User } from "../../entity/User/User";
import { getConnection, getRepository } from "typeorm";
import { AddressResidentialIndicator } from "../../types/shipping-models";


export async function seedData() {
  // console.log("Inserting a new user into the database...");
  //
  // const addr1 = new ShipFromAddress();
  //
  // addr1.name = "Hisoka Morrow";
  // addr1.phoneNumber = "1-934-567-7845";
  // addr1.companyName = "Hisoka LLC";
  // addr1.addressLine1 = "4009 Marathon Boulevard";
  // addr1.addressLine2 = "Ste 100";
  // addr1.addressLine3 = "1st Floor";
  // addr1.cityLocality = "Austin";
  // addr1.stateProvince = "TX";
  // addr1.postalCode = "78756";
  // addr1.countryCode = "US";
  // addr1.nickname = "Greed Island Warehouse";
  // addr1.addressResidentialIndicator = AddressResidentialIndicator.no;

  // const addr2 = new ShipFromAddress();
  //
  // addr2.name = "Luffy Freecs";
  // addr2.phoneNumber = "1-777-567-7845";
  // addr2.companyName = "Gon Engineering";
  // addr2.addressLine1 = "3800 North Lamar";
  // addr2.addressLine2 = "Ste 220";
  // addr2.cityLocality = "Austin";
  // addr2.stateProvince = "TX";
  // addr2.postalCode = "78756";
  // addr2.countryCode = "US";
  // addr2.nickname = "The Hunter Association";
  // addr2.addressResidentialIndicator = AddressResidentialIndicator.no;

  const user = new User();
  user.firstName = "Hisoka";
  user.lastName = "Morrow";
  user.email = "hisoka@bunchesOfScrunches.com";
  user.username = "Magician";
  user.password = "hisokaIsAwesome";

  const userRepo = await getRepository(User);
  const newUser = await userRepo.find();


  await userRepo.save(newUser);
  console.log(`Saved a new user with id: ${newUser.userId}`);
  console.log(`Added User -> ${util.inspect(newUser, true, 6, true)}`);

  // const loadedUserRelations = await userRepo.find({ relations: ["shippingAddresses"] });

  // console.log(`\nLoaded Users: ${util.inspect(userById, true, 8, true)}\n`);

  // console.log(`\nUser Check: ${util.inspect(userCheck, true, 8, true)}\n`);

  // const shipFromRepo = getRepository(ShipFromAddress);
  //
  // const loadedShipFroms = await shipFromRepo.find({
  //   where: { userId: "d94ecca9-b8b8-4464-97ab-668a1d20558a" },
  //   relations: ["user"]
  // });
  //
  // console.log(util.inspect(loadedShipFroms, true, 6, true));
  // TODO: figure out how to add a relation to an existing entity record i.e. User adding a ship from address.
  // await getConnection()
  //   .createQueryBuilder()
  //   .relation(User, "shippingAddresses")
  //   .of(user)
  //   .add(addr2);
}
