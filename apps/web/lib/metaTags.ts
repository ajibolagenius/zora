import { Metadata } from 'next';

interface MetaTagsOptions {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function generatePageMetaTags(options: MetaTagsOptions): Metadata {
  const {
    title,
    description,
    keywords,
    image = '/images/zora-og-image.jpg',
    url = 'https://zora-marketplace.com',
  } = options;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      url,
      type: 'website',
      siteName: 'Zora African Market',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}
