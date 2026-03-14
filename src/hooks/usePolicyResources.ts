import { useMemo, useState } from 'react';

export type PolicyResource = {
  id: string;
  title: string;
  summary: string;
  fileHref: string;
  sourceAgency: string;
  author: string;
  publishedOn: string;
  credential: string;
  citation: string;
};

const defaultResources: PolicyResource[] = [
  {
    id: 'eia-legislative-brief-cirigliano',
    title: 'EIA Legislative Brief - Cirigliano',
    summary:
      'Legislative briefing document focused on energy market conditions, policy framing, and downstream household wealth impacts.',
    fileHref: '/docs/EIA_Legislative_Brief_Cirigliano.pdf',
    sourceAgency: 'U.S. Energy Information Administration (EIA) context and public energy data references',
    author: 'Mike Cirigliano',
    publishedOn: 'March 2026',
    credential: 'Policy Briefing Document',
    citation:
      'Cirigliano, M. (2026). EIA Legislative Brief. Oil Savings Nexus policy resource library.',
  },
];

export function usePolicyResources() {
  const [showCredentialing, setShowCredentialing] = useState(true);

  const resources = useMemo(() => defaultResources, []);

  return {
    resources,
    showCredentialing,
    setShowCredentialing,
  };
}
