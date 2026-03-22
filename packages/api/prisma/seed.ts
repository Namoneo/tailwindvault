import { PrismaClient } from '@prisma/client';

const bcrypt = require('bcryptjs') as {
  hash(value: string, rounds: number): Promise<string>;
};

const prisma = new PrismaClient();

const products = [
  {
    slug: 'ecommerce-navbar-pro',
    name: 'Ecommerce Navbar Pro',
    description: 'Sticky multi-level navigation with promo rails, mega menus, and cart affordances for modern storefronts.',
    category: 'Navigation',
    price: 29,
    teamPrice: 79,
    previewImageUrl: 'https://placehold.co/1200x900?text=Ecommerce+Navbar+Pro',
    downloadUrl: 'https://downloads.tailwindvault.dev/ecommerce-navbar-pro.zip',
    features: ['Sticky states', 'Mobile menu patterns', 'Announcement bar variants']
  },
  {
    slug: 'pricing-table-dark',
    name: 'Pricing Table Dark',
    description: 'High-contrast pricing comparisons with annual toggle, testimonial rail, and enterprise upsell messaging.',
    category: 'Pricing',
    price: 19,
    teamPrice: 59,
    previewImageUrl: 'https://placehold.co/1200x900?text=Pricing+Table+Dark',
    downloadUrl: 'https://downloads.tailwindvault.dev/pricing-table-dark.zip',
    features: ['Dark theme surfaces', 'Billing toggle', 'Plan comparison matrix']
  },
  {
    slug: 'contact-form-glass',
    name: 'Contact Form Glass',
    description: 'Layered glassmorphism inquiry forms with trust badges, location cards, and validation states.',
    category: 'Forms',
    price: 9,
    teamPrice: 29,
    previewImageUrl: 'https://placehold.co/1200x900?text=Contact+Form+Glass',
    downloadUrl: 'https://downloads.tailwindvault.dev/contact-form-glass.zip',
    features: ['Validation hints', 'Glass card treatments', 'Responsive contact sections']
  },
  {
    slug: 'analytics-dashboard-slate',
    name: 'Analytics Dashboard Slate',
    description: 'Executive dashboard panels with KPI tiles, chart zones, and activity streams tuned for SaaS products.',
    category: 'Dashboard',
    price: 39,
    teamPrice: 119,
    previewImageUrl: 'https://placehold.co/1200x900?text=Analytics+Dashboard+Slate',
    downloadUrl: 'https://downloads.tailwindvault.dev/analytics-dashboard-slate.zip',
    features: ['Chart shells', 'Dense tables', 'Executive KPI blocks']
  },
  {
    slug: 'saas-hero-editorial',
    name: 'SaaS Hero Editorial',
    description: 'Editorial hero systems with storytelling copy blocks, product screenshots, and layered visual depth.',
    category: 'Hero',
    price: 24,
    teamPrice: 69,
    previewImageUrl: 'https://placehold.co/1200x900?text=SaaS+Hero+Editorial',
    downloadUrl: 'https://downloads.tailwindvault.dev/saas-hero-editorial.zip',
    features: ['Split layouts', 'Hero media framing', 'Social proof lanes']
  },
  {
    slug: 'checkout-flow-minimal',
    name: 'Checkout Flow Minimal',
    description: 'Minimal one-page checkout with trust copy, order summary, and post-purchase success states.',
    category: 'Checkout',
    price: 34,
    teamPrice: 99,
    previewImageUrl: 'https://placehold.co/1200x900?text=Checkout+Flow+Minimal',
    downloadUrl: 'https://downloads.tailwindvault.dev/checkout-flow-minimal.zip',
    features: ['Order summary', 'Trust badges', 'Success page']
  },
  {
    slug: 'team-settings-command',
    name: 'Team Settings Command',
    description: 'Settings surfaces for team permissions, API keys, billing history, and member management.',
    category: 'Settings',
    price: 27,
    teamPrice: 84,
    previewImageUrl: 'https://placehold.co/1200x900?text=Team+Settings+Command',
    downloadUrl: 'https://downloads.tailwindvault.dev/team-settings-command.zip',
    features: ['Permission tables', 'Billing settings', 'API key management']
  },
  {
    slug: 'testimonial-wall-warm',
    name: 'Testimonial Wall Warm',
    description: 'Warm-toned social proof sections with quote mosaics, customer logos, and press coverage callouts.',
    category: 'Marketing',
    price: 14,
    teamPrice: 44,
    previewImageUrl: 'https://placehold.co/1200x900?text=Testimonial+Wall+Warm',
    downloadUrl: 'https://downloads.tailwindvault.dev/testimonial-wall-warm.zip',
    features: ['Logo grids', 'Quote cards', 'Editorial pull quotes']
  },
  {
    slug: 'admin-panel-atlas',
    name: 'Admin Panel Atlas',
    description: 'Internal tooling layouts for moderation queues, release dashboards, and support escalations.',
    category: 'Admin',
    price: 49,
    teamPrice: 149,
    previewImageUrl: 'https://placehold.co/1200x900?text=Admin+Panel+Atlas',
    downloadUrl: 'https://downloads.tailwindvault.dev/admin-panel-atlas.zip',
    features: ['Moderation queue', 'Ops metrics', 'Filterable lists']
  },
  {
    slug: 'auth-screen-luxe',
    name: 'Auth Screen Luxe',
    description: 'Premium sign-in and registration templates with editorial copy, trust accents, and account benefits.',
    category: 'Auth',
    price: 17,
    teamPrice: 49,
    previewImageUrl: 'https://placehold.co/1200x900?text=Auth+Screen+Luxe',
    downloadUrl: 'https://downloads.tailwindvault.dev/auth-screen-luxe.zip',
    features: ['Sign-in layout', 'Registration variant', 'Trust content slots']
  }
] as const;

async function main() {
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
  const buyerPasswordHash = await bcrypt.hash('BuyerPass123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@tailwindvault.dev' },
    update: {
      name: 'TailwindVault Admin',
      passwordHash: adminPasswordHash,
      role: 'admin'
    },
    create: {
      name: 'TailwindVault Admin',
      email: 'admin@tailwindvault.dev',
      passwordHash: adminPasswordHash,
      role: 'admin'
    }
  });

  await prisma.user.upsert({
    where: { email: 'buyer@tailwindvault.dev' },
    update: {
      name: 'TailwindVault Buyer',
      passwordHash: buyerPasswordHash,
      role: 'customer'
    },
    create: {
      name: 'TailwindVault Buyer',
      email: 'buyer@tailwindvault.dev',
      passwordHash: buyerPasswordHash,
      role: 'customer'
    }
  });

  for (const product of products) {
    const { features, ...productRecord } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productRecord,
        featuresJson: JSON.stringify(features)
      },
      create: {
        ...productRecord,
        featuresJson: JSON.stringify(features)
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
