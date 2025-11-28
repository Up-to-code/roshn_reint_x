export default {
  datamodel: "prisma/schema.prisma",
  db: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },
};
