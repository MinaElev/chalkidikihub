import { JsonLd as V4 } from '@/components/seo/JsonLd';

/** v3 signature for ported pages. */
export function JsonLd({ data }: { data: Record<string, unknown> | object }) {
  return <V4 data={data} />;
}
