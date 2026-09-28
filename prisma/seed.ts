import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingProfile = await prisma.profile.findFirst();
  const profile =
    existingProfile ??
    (await prisma.profile.create({
      data: {
        displayName: "Rebel Mind Zone",
        bio: "A bold creative mind that dares to challenge the ordinary in order to create extraordinary ideas.",
        theme: "dark",
        blurPx: 24,
        scrimOpacity: 0.5,
        accentColor: "red",
        buttonStyle: "glass",
      },
    }));

  const linkCount = await prisma.link.count();
  if (linkCount === 0) {
    await prisma.link.createMany({
      data: [
        {
          type: "link",
          title: "Latest Drop",
          url: "https://example.com/shop",
          subtitle: "Shop the newest collection",
          icon: "🔥",
          featured: true,
          order: 0,
        },
        {
          type: "link",
          title: "Watch the Manifesto",
          url: "https://example.com/video",
          subtitle: "3 min watch",
          icon: "🎬",
          order: 1,
        },
        {
          type: "link",
          title: "Read the Blog",
          url: "https://example.com/blog",
          icon: "✍️",
          order: 2,
        },
        {
          type: "link",
          title: "Join the Newsletter",
          url: "https://example.com/newsletter",
          subtitle: "Rebellion, delivered weekly",
          icon: "📬",
          order: 3,
        },
        {
          type: "social",
          title: "Instagram",
          url: "https://instagram.com/rebelmindzone",
          subtitle: "@rebelmindzone",
          icon: "📸",
          order: 4,
        },
        {
          type: "social",
          title: "TikTok",
          url: "https://tiktok.com/@rebelmindzone",
          subtitle: "@rebelmindzone",
          icon: "🎵",
          order: 5,
        },
        {
          type: "social",
          title: "X",
          url: "https://x.com/rebelmindzone",
          subtitle: "Follow us",
          icon: "✖️",
          order: 6,
        },
      ],
    });
  }

  console.log(`Seeded profile "${profile.displayName}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
