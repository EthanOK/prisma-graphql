import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  for (let i = 0; i < 5; i++) {
    const random = Math.floor(Math.random() * 10000) + 1;

    const userData = await prisma.user.create({
      data: {
        name: `John Doe${random}`,
        email: `john.doe${random}@example.com`,
      },
    });
    console.log(userData);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
