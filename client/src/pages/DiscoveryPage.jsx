import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import TitleList from '../components/TitleList.jsx';
import DiscoveryFilters from '../components/DiscoveryFilters.jsx';
import PaginationControls from '../components/PaginationControls.jsx';
import DiscoveryStats from '../components/DiscoveryStats.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://oss-backend-ijrl.onrender.com/api';
const EMPTY_AGGREGATES = { withAssets: 0, withOpportunities: 0, readyEpisodes: 0 };

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json();
};

function DiscoveryPage({ role }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ hasAssets: false, hasOpportunities: false, sort: 'alpha' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [titles, setTitles] = useState([]);
  const [catalogMeta, setCatalogMeta] = useState({ total: 0, totalPages: 1, aggregates: EMPTY_AGGREGATES });
  const [listStatus, setListStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show loading state immediately
    setListStatus({ loading: true, error: '' });

    const params = new URLSearchParams({
      role,
      search: searchTerm,
      page: String(page),
      pageSize: String(pageSize),
      sort: filters.sort
    });
    if (filters.hasAssets) {
      params.set('hasAssets', 'true');
    }
    if (filters.hasOpportunities) {
      params.set('hasOpportunities', 'true');
    }

    fetchJson(`${API_BASE}/titles?${params.toString()}`, {
      signal: controller.signal
    })
      .then((data) => {
        setTitles(data.results);
        setCatalogMeta({
          total: data.total,
          totalPages: data.totalPages,
          aggregates: data.aggregates || EMPTY_AGGREGATES
        });
        if (data.page !== page) {
          setPage(data.page);
        }
        setListStatus({ loading: false, error: '' });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setListStatus({ loading: false, error: error.message || 'Unable to load titles' });
        setTitles([]);
      });
    return () => controller.abort();
  }, [role, searchTerm, filters, page, pageSize]);

  const startIndex = catalogMeta.total === 0 ? 0 : (page - 1) * pageSize;
  const aggregates = catalogMeta.aggregates || EMPTY_AGGREGATES;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleFilterToggle = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    setPage(1);
  };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({ ...prev, sort }));
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    const totalPages = catalogMeta.totalPages || 1;
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(clamped);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const handleTitleSelect = (titleId) => {
    navigate(`/title/${titleId}`);
  };

  return (
    <>
      <DiscoveryStats total={catalogMeta.total} aggregates={aggregates} />

      <section className="search-panel">
        <SearchBar value={searchTerm} onChange={handleSearchChange} loading={listStatus.loading} />
        {listStatus.error && <p className="error-text">{listStatus.error}</p>}
        <DiscoveryFilters filters={filters} onToggle={handleFilterToggle} onSortChange={handleSortChange} />
      </section>

      <div className="title-column">
        <TitleList
          titles={titles}
          
          onSelect={handleTitleSelect}
          loading={listStatus.loading}
          startIndex={startIndex}
        />
        <PaginationControls
          page={catalogMeta.total === 0 ? 0 : page}
          totalPages={catalogMeta.total === 0 ? 0 : catalogMeta.totalPages}
          total={catalogMeta.total}
          pageSize={pageSize}
          currentCount={titles.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </>
  );
}

export default DiscoveryPage;
