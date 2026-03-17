const fs = require('node:fs');
const YAML = require('yaml');

const SWAGGER_PATH = 'docs/swagger.yaml';

function genLoginExample(faker) {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };
}

function genOfferExample(faker) {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    publishDate: faker.date.recent().toISOString().slice(0, 10),
    city: faker.helpers.arrayElement([
      'Paris',
      'Cologne',
      'Brussels',
      'Amsterdam',
      'Hamburg',
      'Dusseldorf',
    ]),
    isPremium: faker.datatype.boolean(),
    isFavorite: faker.datatype.boolean(),
    rating: Number(faker.number.float({ min: 1, max: 5, fractionDigits: 1 })),
    type: faker.helpers.arrayElement(['apartment', 'house', 'room', 'hotel']),
    rooms: faker.number.int({ min: 1, max: 5 }),
    guests: faker.number.int({ min: 1, max: 8 }),
    price: faker.number.int({ min: 50, max: 500 }),
    features: JSON.stringify([
      'Breakfast',
      'Air conditioning',
      'Laptop friendly workspace',
      'Baby seat',
      'Washer',
      'Towels',
      'Fridge',
    ]),
    commentsCount: faker.number.int({ min: 0, max: 50 }),
    latitude: Number(faker.location.latitude()),
    longitude: Number(faker.location.longitude()),
    userId: faker.number.int({ min: 1, max: 10 }),
  };
}

async function main() {
  const { faker } = await import('@faker-js/faker');
  const raw = fs.readFileSync(SWAGGER_PATH, 'utf-8');
  const doc = YAML.parse(raw);

  const loginContent = doc?.paths?.['/login']?.post?.requestBody?.content?.['application/json'];
  if (!loginContent) {
    console.error('Не найден /login POST requestBody content application/json — проверь swagger.yaml');
    process.exit(1);
  }
  loginContent.example = genLoginExample(faker);

  const offerContent =
    doc?.paths?.['/offers']?.post?.requestBody?.content?.['multipart/form-data'] ??
    doc?.paths?.['/offer']?.post?.requestBody?.content?.['multipart/form-data'];

  if (offerContent) {
    offerContent.examples = {
      generated: {
        summary: 'Сгенерированный пример (только текстовые поля)',
        value: genOfferExample(faker),
      },
    };
  } else {
    console.error('Не найден /offers POST requestBody content multipart/form-data — проверь swagger.yaml');
    process.exit(1);
  }

  fs.writeFileSync(SWAGGER_PATH, YAML.stringify(doc, null, 2), 'utf-8');
  console.log('Готово! Examples для POST /login и POST /offers записаны в', SWAGGER_PATH);
}

main().catch((error) => {
  console.error('Ошибка генерации примеров:', error);
  process.exit(1);
});
