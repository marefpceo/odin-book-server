import { PrismaClient } from './generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const adapter = new PrismaPg({
  connectionString: `${process.env.DATABASE_URL}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashpass = await argon2.hash('kkkkkkkkk', {
    type: argon2.argon2id,
    memoryCost: 47104,
    timeCost: 1,
    parallelism: 1,
  });
  /********************************* Seed Users ********************************/
  console.log('Adding users');

  const james = await prisma.user.upsert({
    where: { email: 'james1@test.com' },
    update: {
      post: {
        create: {
          content: 'James post created from seed.',
        },
      },
    },
    create: {
      username: 'jimmyOne',
      email: 'james1@test.com',
      password: hashpass,
      profile: {
        create: {
          firstname: 'James',
          lastname: 'Roundtree',
          avatar: 'NULL',
          bio: 'Happy go lucky who likes to fish',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  const kate = await prisma.user.upsert({
    where: { email: 'kate@test.com' },
    update: {
      post: {
        create: {
          content: 'Kate post from seed.',
        },
      },
    },
    create: {
      username: 'katiedid',
      email: 'kate@test.com',
      password: hashpass,
    },
  });

  const billy = await prisma.user.upsert({
    where: { email: 'willbill@test.com' },
    update: {
      post: {
        create: {
          content: 'Bill post from seed.',
        },
      },
    },
    create: {
      username: 'billy',
      email: 'willbill@test.com',
      password: hashpass,
    },
  });

  console.log({ james, kate, billy });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
