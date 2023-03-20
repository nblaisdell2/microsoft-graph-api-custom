import { User } from "@microsoft/microsoft-graph-types";
import express, { Router, Request, Response, NextFunction } from "express";
import { getUsersAsync } from "../graph/graphHelper";

async function listUsersAsync() {
  try {
    const userPage = await getUsersAsync();
    const users: User[] = userPage.value;

    return users;

    // // Output each user's details
    // for (const user of users) {
    //   console.log(`User: ${user.displayName ?? "NO NAME"}`);
    //   console.log(`  ID: ${user.id}`);
    //   console.log(`  Email: ${user.mail ?? "NO EMAIL"}`);
    // }

    // // If @odata.nextLink is not undefined, there are more users
    // // available on the server
    // const moreAvailable = userPage["@odata.nextLink"] != undefined;
    // console.log(`\nMore users available? ${moreAvailable}`);
  } catch (err) {
    console.log(`Error getting users: ${err}`);
  }
}

const router: Router = express.Router();
/* GET home page. */
router.get(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    const userData = await listUsersAsync();
    res.status(200).json(userData);
  }
);

export default router;
