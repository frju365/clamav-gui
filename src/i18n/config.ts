export type LangCode = "en" | "hy" | "ru" | "pl"
type CountryCode = "us" | "am" | "ru" | "pl"
type languageOption = { language: string; code: LangCode, countryCode: CountryCode };
import * as DateFnsLocale from "date-fns/locale"

export const languageOptions: languageOption[] = [
     { language: "English", code: "en", countryCode: "us"},
     { language: "Հայերեն", code: "hy", countryCode: "am"},
     { language: "Русский", code: "ru", countryCode: "ru"},
     { language: "Polski", code: "pl", countryCode: "pl" }
];

export const dateFnsLanguages: Record<LangCode,DateFnsLocale.Locale> = {
     en: DateFnsLocale.enUS,
     hy: DateFnsLocale.hy,
     ru: DateFnsLocale.ru,
     pl: DateFnsLocale.pl
}

export const suffixWhitelist: Set<LangCode> = new Set(["en"])