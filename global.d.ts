import { routing } from "./src/i18n/routing";
import en from "./src/messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
