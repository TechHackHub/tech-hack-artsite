import {
  AchievementCategory,
  AchievementSubcategory,
  PrismaClient,
} from '@prisma/client';
import Bcrypt from '../app/libs/bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create initial artist
  await prisma.artist.upsert({
    where: { email: 'stark@mail.com' },
    update: {},
    create: {
      avatar: 'http://localhost:3000/url',
      name: 'StarkLin',
      born: '1996, Taiwan',
      educations: ['Master'],
      description: 'hello world',
      email: 'stark@mail.com',
      password: await Bcrypt.hashPassword('test123'),
      phone: '',
      facebookUrl: '',
      IGUrl: '',
    },
  });

  // Seed Materials
  const materials = [
    { name: 'Oil Paint' },
    { name: 'Acrylic Paint' },
    { name: 'Canvas' },
    { name: 'Wood Panel' },
    { name: 'Watercolor' },
    { name: 'Charcoal' },
    { name: 'Bronze' },
    { name: 'Marble' },
    { name: 'Clay' },
    { name: 'Mixed Media' },
  ];

  // Seed Subjects
  const subjects = [
    { name: 'Landscape' },
    { name: 'Portrait' },
    { name: 'Still Life' },
    { name: 'Abstract' },
    { name: 'Figure' },
    { name: 'Nature' },
    { name: 'Urban' },
    { name: 'Conceptual' },
  ];

  // Seed Achievements
  const achievements = [
    {
      title: 'Solo Exhibition at Modern Art Gallery',
      year: new Date('2023-06-15'),
      category: AchievementCategory.Exhibition,
      subcategory: AchievementSubcategory.Solo,
      organization: 'Modern Art Gallery',
      location: 'New York, NY',
      publish: true,
    },
    {
      title: 'Annual Art Prize Winner',
      year: new Date('2023-03-20'),
      category: AchievementCategory.Award,
      organization: 'National Art Foundation',
      location: 'Chicago, IL',
      publish: true,
    },
    {
      title: 'Group Exhibition: New Perspectives',
      year: new Date('2022-11-10'),
      category: AchievementCategory.Exhibition,
      subcategory: AchievementSubcategory.Group,
      organization: 'Contemporary Arts Museum',
      location: 'Los Angeles, CA',
      publish: true,
    },
    {
      title: 'Permanent Collection Acquisition',
      year: new Date('2022-08-01'),
      category: AchievementCategory.Collection,
      organization: 'Metropolitan Museum of Art',
      location: 'New York, NY',
      publish: true,
    },
  ];

  // Insert Materials
  for (const material of materials) {
    await prisma.material.upsert({
      where: { name: material.name },
      update: material,
      create: material,
    });
  }

  // Insert Subjects
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: subject,
      create: subject,
    });
  }

  // Insert Achievements
  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }
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
