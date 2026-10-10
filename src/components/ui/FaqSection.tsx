import { getTranslations, getLocale } from 'next-intl/server';
import { Faq } from './Faq';

/** v3 signature ({question, answer}) on top of the v4 Faq component. */
export async function FaqSection({ faqs, title }: { faqs: Array<{ question: string; answer: string }>; title?: string }) {
  const t = await getTranslations({ locale: await getLocale(), namespace: 'common' });
  return <Faq title={title ?? t('faqTitle')} items={faqs.map((f) => ({ q: f.question, a: f.answer.replace(/<[^>]+>/g, '') }))} />;
}
