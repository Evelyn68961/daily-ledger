import { useEffect, useState } from 'react';
import { I18N } from './i18n';
import { LangContext } from './lang-context';
import { getLang, setLang as persistLang } from './storage';

export default function LangProvider({ children }) {
  const [lang, setLangState] = useState('zh');

  useEffect(() => {
    getLang().then((stored) => {
      setLangState(stored === 'en' ? 'en' : 'zh');
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  }, [lang]);

  function setLang(next) {
    setLangState(next);
    persistLang(next);
  }

  const t = I18N[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
