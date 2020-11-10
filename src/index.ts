import { startServer } from "./utils/startApolloExpress";
import { seedData } from "./utils/db/seed";

startServer()
  .then(async () => {
    // await seedData();
  })
  .catch(err => console.error(err));
