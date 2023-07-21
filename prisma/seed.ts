import {
  AccountState,
  AccountType,
  ActivityStatus,
  CampaignStatus,
  LeadStatus,
  PrismaClient,
  WarmupStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.create({
    data: {
      name: faker.company.name(),
    },
  });
  const user = await prisma.user.create({
    data: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      auth0Id: faker.datatype.uuid(),
    },
  });
  const account = await prisma.account.create({
    data: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      type: faker.helpers.arrayElement(Object.values(AccountType)),
      state: faker.helpers.arrayElement(Object.values(AccountState)),
      addedById: user.id,
      modifiedById: user.id,
      organizationId: organization.id,
      code: faker.string.alphanumeric(7),
    },
  });

  for (let i = 0; i <= Array.from({ length: 3 }).length; i++) {
    await prisma.campaign.create({
      data: {
        name: faker.company.bs(),
        organizationId: organization.id,
        addedById: account.id,
        modifiedById: account.id,
        status: faker.helpers.arrayElement(Object.values(CampaignStatus)),
        accountIds: [account.id],
        leads: {
          createMany: {
            data: Array.from({ length: faker.datatype.number({ min: 25, max: 50 }) }, () => ({
              firstName: faker.name.firstName(),
              organizationId: organization.id,
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
              companyName: faker.company.name(),
              status: faker.helpers.arrayElement(Object.values(LeadStatus)),
            })),
          },
        },
      },
    });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { organizationId: organization.id },
    include: {
      leads: {
        select: {
          email: true,
          id: true,
        },
      },
    },
  });

  for (const campaign of campaigns) {
    await prisma.activity.createMany({
      data: Array.from({ length: faker.datatype.number({ min: 150, max: 200 }) }, (v, k) => ({
        leadEmail: faker.helpers.arrayElement(campaign.leads.map(lead => lead.email)),
        step: faker.datatype.number({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement(k % 10 == 0 ? [ActivityStatus.CONTACTED] : Object.values(ActivityStatus)),
        messageId: faker.datatype.uuid(),
        accountId: account.id,
        campaignId: campaign.id,
        organizationId: organization.id,
        createdAt: faker.date.between(dayjs().subtract(6, 'd').toISOString(), dayjs().toISOString()),
      })),
    });
  }

  await prisma.warmup.createMany({
    data: Array.from({ length: faker.datatype.number({ min: 150, max: 200 }) }, (v, k) => ({
      status: faker.helpers.arrayElement(k % 10 == 0 ? [WarmupStatus.SENT] : Object.values(WarmupStatus)),
      messageId: faker.datatype.uuid(),
      recipientAccountId: account.id,
      senderAccountId: account.id,
      organizationId: organization.id,
      createdAt: faker.date.between(dayjs().subtract(6, 'd').toISOString(), dayjs().toISOString()),
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });
