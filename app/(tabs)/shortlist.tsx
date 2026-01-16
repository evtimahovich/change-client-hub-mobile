import React from 'react';
import { Shortlist } from '../../components/Shortlist';
import { useApp } from '../../contexts/AppContext';

export default function ShortlistScreen() {
  const { visibleCandidates } = useApp();
  const shortlistedCandidates = visibleCandidates.filter(c => c.shortlisted);
  return <Shortlist candidates={shortlistedCandidates} />;
}
