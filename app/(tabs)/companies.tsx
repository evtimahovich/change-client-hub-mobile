import React from 'react';
import { CompanyList } from '../../components/CompanyList';
import { useApp } from '../../contexts/AppContext';

export default function CompaniesScreen() {
  const { companies } = useApp();
  return <CompanyList companies={companies} />;
}
