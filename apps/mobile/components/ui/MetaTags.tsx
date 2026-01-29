/**
 * MetaTags Component
 * Renders meta tags for SEO and Open Graph on web
 * Only renders on web platform
 */

import { Platform } from 'react-native';
import Head from 'expo-router/head';
import { generateMetaTags, type MetaTagData } from '../../lib/metaTags';

interface MetaTagsProps {
  data: MetaTagData;
}

export default function MetaTags({ data }: MetaTagsProps) {
  // Only render meta tags on web
  if (Platform.OS !== 'web') {
    return null;
  }

  const metaTags = generateMetaTags(data);

  return (
    <Head>
      <title>{data.title.includes('Zora African Market') ? data.title : `${data.title} | Zora African Market`}</title>
      {metaTags.map((tag, index) => {
        if (tag.name) {
          return <meta key={`name-${index}`} name={tag.name} content={tag.content} />;
        }
        if (tag.property) {
          return <meta key={`property-${index}`} property={tag.property} content={tag.content} />;
        }
        return null;
      })}
    </Head>
  );
}
