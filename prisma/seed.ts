import { hash } from "bcrypt";
import { prisma } from "../src/services/prisma";

export async function main() {
  const password1 = await hash("User1234", 8);
  const password2 = await hash("User1234", 8);

  await prisma.user.create({
    data: {
      username: "user",
      password: password1,
      account: {
        create: {
          balanceInCents: 100 * 100,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      username: "xandon",
      password: password2,
      account: {
        create: {
          balanceInCents: 100 * 100,
        },
      },
    },
  });
}

main();
