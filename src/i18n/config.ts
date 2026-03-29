export type LangCode = "en" | "hy" | "ru" | "fr"
type CountryCode = "us" | "am" | "ru" | "fr"
type languageOption = { language: string; code: LangCode, countryCode: CountryCode };
import {enUS,hy,ru,fr, type Locale} from "date-fns/locale"

export const languageOptions: languageOption[] = [
     { language: "English", code: "en", countryCode: "us"},
     { language: "Français", code: "fr", countryCode: "fr"},
     { language: "Հայերեն", code: "hy", countryCode: "am"},
     { language: "Русский", code: "ru", countryCode: "ru"}
];

export const dateFnsLanguages: Record<LangCode,Locale> = {
     en: enUS,
     hy, ru, fr
}

export const suffixWhitelist: Set<LangCode> = new Set(["en"])