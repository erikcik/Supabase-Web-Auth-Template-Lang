import PublicFeed from "@/components/PublicFeed";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('Home');
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {t('description')}
        </p>
      </div>
      
      <PublicFeed />
    </div>
  );
}
