import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  // [...Array.from(Array(500).keys())].forEach(async (num) => {
  //   await client.stream.create({
  //     data: {
  //       name: String(num),
  //       description: String(num),
  //       price: num,
  //       user: {
  //         connect: {
  //           id: 1,
  //         },
  //       },
  //     },
  //   });
  // });
}

main()
  .catch((e) => console.error(e))
  .finally(() => client.$disconnect());
