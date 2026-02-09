import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // html lang ni ham moslab qo‘yamiz
    document.documentElement.lang = i18n.language || "uz";
  }, [i18n.language]);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("imor_lang", code);
  };

  return (
    <div className="lang-switch">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          className={i18n.language === l.code ? "lang-btn active" : "lang-btn"}
          onClick={() => changeLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
