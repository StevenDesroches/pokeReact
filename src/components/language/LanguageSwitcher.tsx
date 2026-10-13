import { Select, type SelectProps } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitch(props: SelectProps) {
  const { i18n } = useTranslation();

  return (
    <Select
      value={i18n.language}
      onChange={(lang) => lang && i18n.changeLanguage(lang)}
      data={[
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
        // { value: 'es', label: 'Español' },
      ]}
      w={120}
      aria-label="Select language"
      {...props}
    />
  );
}