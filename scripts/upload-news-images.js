const contentful = require('contentful-management');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT_ID = 'master';

// Mapping: entryId -> { imageUrl, title }
const articles = [
  {
    entryId: '22BzfJoQDKhNWiYf198seo',
    slug: 'circle-alkemia-entra-nel-capitale',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/03/Circle-screen.png',
    title: 'Circle - Alkemia entra nel capitale',
  },
  {
    entryId: '7asPa3Nqz5yFNuY9yuXYAm',
    slug: 'contents-qatar-investe-round-7-milioni',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/02/Contents_page-0001-1.jpg',
    title: 'Contents - Qatar investe round 7 milioni',
  },
  {
    entryId: '7wZAKltGsymnv9DntS7bV0',
    slug: 'integrazione-esg-governance',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-27-at-17.43.18.jpeg',
    title: 'Integrazione ESG governance',
  },
  {
    entryId: 'nylsNbsqEdck8TEsDyd1O',
    slug: 'alkemia-capital-investor-day',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/11/0X4A0266-scaled.jpg',
    title: 'Alkemia Capital Investor Day',
  },
  {
    entryId: '5jugTsBzdrkYPotOfXs02n',
    slug: 'thf-us-stakeholders-meeting',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-22-at-17.48.31.jpeg',
    title: 'THF US Stakeholders Meeting',
  },
  {
    entryId: '6fed2jpzrrrybUYD3Yiy5y',
    slug: 'convivio-polo-pasta-fresca',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-12.26.34.jpeg',
    title: 'Convivio polo pasta fresca',
  },
  {
    entryId: '4Fyn6kgVM0Wk5K9YvvuLTB',
    slug: 'rapporto-investitori-istituzionali',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.22.15.jpeg',
    title: 'Rapporto investitori istituzionali',
  },
  {
    entryId: 'ySYESp2w7doXru26s2cOo',
    slug: 'tecno-societa-quotata',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-12.08.47.jpeg',
    title: 'Tecno societa quotata',
  },
  {
    entryId: '1utS9ouxx8IG87CTS2iAOr',
    slug: 'redelfi-growth-milan',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-10.20.59.jpeg',
    title: 'Redelfi Growth Milan',
  },
  {
    entryId: '1RIQI8ypU1fHXz1vpC68o9',
    slug: 'ermes-gitex-europe-berlin',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/doc1_page-0001.jpg',
    title: 'Ermes GITEX Europe Berlin',
  },
  {
    entryId: '5edz7kQQhwhpfOc6iBXN4D',
    slug: 'vc-investing-language-ai-slatorcon',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-10.08.35.jpeg',
    title: 'VC investing language AI SlatorCon',
  },
  {
    entryId: '5yo5BBhpUoLmuzr6OenXv0',
    slug: 'previdenza-strategie-venture-capital',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-10.12.35.jpeg',
    title: 'Previdenza strategie venture capital',
  },
  {
    entryId: '7075QENYbp1QQTkR5rqZh4',
    slug: 'alkemia-monaco-miif-2025',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/03/Miif2025.jpeg',
    title: 'Alkemia Monaco MIIF 2025',
  },
  {
    entryId: '4E4gjT3k13clhWmIIrslom',
    slug: 'alkemia-nuova-fase-crescita',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/02/2023-07-24-Urbanfile-Milano-San-Babila-Piazza_8.png',
    title: 'Alkemia nuova fase crescita',
  },
  {
    entryId: '6tLzE5UhBy610JECr2nz7c',
    slug: 'alkemia-rafforza-boutique-investimenti',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-08-at-18.03.10.jpeg',
    title: 'Alkemia rafforza boutique investimenti',
  },
  {
    entryId: '3wL8DwBsM41LqUpTaZkQY9',
    slug: 'alkemia-burocrazia-fondi-italiani',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.29.49.jpeg',
    title: 'Alkemia burocrazia fondi italiani',
  },
  {
    entryId: '5T2h6LJ8dHdAkD1v0lnWLT',
    slug: 'alkemia-nuovi-soci-aum-200-milioni',
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.36.38.jpeg',
    title: 'Alkemia nuovi soci AUM 200 milioni',
  },
];

function getContentType(url) {
  if (url.endsWith('.png')) return 'image/png';
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
  if (url.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

function getFileName(url) {
  return url.split('/').pop();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT_ID);

  console.log(`Processing ${articles.length} articles...\n`);

  for (const article of articles) {
    console.log(`--- ${article.slug} ---`);

    // Check if entry already has a featuredImage
    let entry;
    try {
      entry = await environment.getEntry(article.entryId);
    } catch (err) {
      console.error(`  ERROR: Could not fetch entry ${article.entryId}: ${err.message}`);
      continue;
    }

    // Check if featuredImage already set (in it-IT locale or default)
    const existingImage =
      entry.fields.featuredImage?.['it-IT'] ||
      entry.fields.featuredImage?.['en-US'] ||
      entry.fields.featuredImage;

    if (existingImage?.sys?.id) {
      console.log(`  Already has featuredImage (asset ${existingImage.sys.id}), skipping.`);
      continue;
    }

    // 1. Create asset
    const fileName = getFileName(article.imageUrl);
    const contentType = getContentType(article.imageUrl);

    console.log(`  Creating asset: ${fileName}`);
    let asset;
    try {
      asset = await environment.createAsset({
        fields: {
          title: {
            'it-IT': `News: ${article.title}`,
            'en-US': `News: ${article.title}`,
          },
          file: {
            'it-IT': {
              contentType,
              fileName,
              upload: article.imageUrl,
            },
            'en-US': {
              contentType,
              fileName,
              upload: article.imageUrl,
            },
          },
        },
      });
    } catch (err) {
      console.error(`  ERROR creating asset: ${err.message}`);
      continue;
    }

    // 2. Process asset (downloads from URL)
    console.log(`  Processing asset...`);
    try {
      asset = await asset.processForAllLocales();
    } catch (err) {
      console.error(`  ERROR processing asset: ${err.message}`);
      continue;
    }

    // Wait for processing to complete
    let attempts = 0;
    while (attempts < 20) {
      await sleep(2000);
      asset = await environment.getAsset(asset.sys.id);
      const itFile = asset.fields.file?.['it-IT'];
      const enFile = asset.fields.file?.['en-US'];
      if (itFile?.url && enFile?.url) {
        break;
      }
      attempts++;
      console.log(`  Waiting for processing... (${attempts})`);
    }

    // 3. Publish asset
    console.log(`  Publishing asset...`);
    try {
      asset = await asset.publish();
    } catch (err) {
      console.error(`  ERROR publishing asset: ${err.message}`);
      continue;
    }

    // 4. Link asset to entry's featuredImage field
    console.log(`  Linking asset ${asset.sys.id} to entry ${article.entryId}...`);
    try {
      // Re-fetch the entry to get latest version
      entry = await environment.getEntry(article.entryId);

      const assetLink = {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: asset.sys.id,
        },
      };

      if (!entry.fields.featuredImage) {
        entry.fields.featuredImage = {};
      }
      entry.fields.featuredImage['it-IT'] = assetLink;
      entry.fields.featuredImage['en-US'] = assetLink;

      entry = await entry.update();
      console.log(`  Updated entry. Publishing...`);
      await entry.publish();
      console.log(`  DONE: ${article.slug}\n`);
    } catch (err) {
      console.error(`  ERROR linking/publishing entry: ${err.message}`);
      continue;
    }

    // Small delay to avoid rate limits
    await sleep(500);
  }

  console.log('All done!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
