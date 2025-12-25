'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scholar } from '@/data/scholars';
import { useLanguage } from '@/i18n/LanguageContext';

interface ScholarTableProps {
  scholars: Scholar[];
}

type SortKey = 'name' | 'cited_by_count' | 'h_index' | 'works_count' | 'institution';
type SortOrder = 'asc' | 'desc';

export function ScholarTable({ scholars }: ScholarTableProps) {
  const { t } = useLanguage();
  const [sortKey, setSortKey] = useState<SortKey>('cited_by_count');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const filteredScholars = scholars.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedScholars = [...filteredScholars].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sortedScholars.length / itemsPerPage);
  const paginatedScholars = sortedScholars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) => (
    <span className={`ml-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
      {active ? (order === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Deep Learning & Neuro': 'bg-purple-100 text-purple-800',
      'Computational Cognition': 'bg-green-100 text-green-800',
      'Bayesian & Statistical Neuro': 'bg-blue-100 text-blue-800',
      'Systems Neuroscience': 'bg-orange-100 text-orange-800',
      'Neural Dynamics & Modeling': 'bg-pink-100 text-pink-800',
      'Theoretical Neuroscience': 'bg-indigo-100 text-indigo-800',
      'Network & Connectome': 'bg-cyan-100 text-cyan-800',
      'Visual & Perceptual Computation': 'bg-amber-100 text-amber-800',
      'Motor Control & Sensorimotor': 'bg-lime-100 text-lime-800',
      'Methods & Tools': 'bg-rose-100 text-rose-800',
      'Cognitive Neuroscience': 'bg-teal-100 text-teal-800',
      'Consciousness & Philosophy': 'bg-violet-100 text-violet-800',
      'Auditory Computation': 'bg-emerald-100 text-emerald-800',
      'AI Research': 'bg-fuchsia-100 text-fuchsia-800',
      'Neurotech & AI': 'bg-sky-100 text-sky-800',
      'Computational Neuroscience': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-800">{t.scholarTable.title}</h3>
          <input
            type="text"
            placeholder={t.scholarTable.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.scholarTable.rank}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                {t.scholarTable.name} <SortIcon active={sortKey === 'name'} order={sortOrder} />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('cited_by_count')}
              >
                {t.common.citations} <SortIcon active={sortKey === 'cited_by_count'} order={sortOrder} />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('h_index')}
              >
                {t.common.hIndex} <SortIcon active={sortKey === 'h_index'} order={sortOrder} />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('works_count')}
              >
                {t.common.publications} <SortIcon active={sortKey === 'works_count'} order={sortOrder} />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('institution')}
              >
                {t.common.institution} <SortIcon active={sortKey === 'institution'} order={sortOrder} />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.common.category}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedScholars.map((scholar, idx) => (
              <tr key={scholar.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <Link
                        href={`/scholar/${scholar.id.split('/').pop()}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {scholar.name}
                      </Link>
                      <div className="text-sm text-gray-500">{scholar.country}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {scholar.cited_by_count.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {scholar.h_index}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {scholar.works_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                  {scholar.institution || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(scholar.category)}`}>
                    {scholar.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {t.common.showing} {(currentPage - 1) * itemsPerPage + 1} {t.common.to} {Math.min(currentPage * itemsPerPage, sortedScholars.length)} {t.common.of} {sortedScholars.length} {t.common.scholars}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {t.common.previous}
          </button>
          <span className="px-3 py-1 text-sm">
            {t.common.page} {currentPage} {t.common.of} {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {t.common.next}
          </button>
        </div>
      </div>
    </div>
  );
}
