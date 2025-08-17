export type Site = {
  id: string;
  name: string;
  createdAt: string;
  fallbackLang: string;
  languages: string[];
  apiKey: string;
  domain?: string;
  customDomain?: string;
};
