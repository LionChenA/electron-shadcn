import { useTranslation } from 'react-i18next';
import langs from '@/localization/langs';
import { setAppLanguage } from '@/localization/service';
import { ToggleGroup, ToggleGroupItem } from './ui/ToggleGroup';

export default function LangToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  function onValueChange(value: string) {
    setAppLanguage(value, i18n);
  }

  return (
    <ToggleGroup type="single" onValueChange={onValueChange} value={currentLang}>
      {langs.map((lang) => (
        <ToggleGroupItem key={lang.key} value={lang.key} variant="outline" size="lg">
          {`${lang.prefix}`}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
