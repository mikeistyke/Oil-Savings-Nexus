/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMAZON_AFFILIATE_TAG?: string;
  readonly VITE_AFFILIATE_ANALYTICS_KEY?: string;
  readonly VITE_ADSENSE_OVERVIEW_SLOT?: string;
  readonly VITE_ADSENSE_ESSAY_SLOT?: string;
  readonly VITE_ADSENSE_SHOP_SLOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
