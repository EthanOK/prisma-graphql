import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  for (let i = 0; i < 5; i++) {
    const random = Math.floor(Math.random() * 10000) + 1;
    let authorId = Math.floor(Math.random() * 5) + 1;

    const postData = await prisma.post.create({
      data: {
        title: `title ${random}`,
        content: `content ${authorId}`,
        authorId: i + 1,
      },
    });
    console.log(postData);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
