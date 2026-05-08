import { useEffect, useState } from 'react';
import { safeFetch } from '../lib/webapi';
import InformationFeed, { type InformationRecord } from '../components/InformationFeed';

interface ApiResponse {
  value: InformationRecord[];
}

const Home = () => {
  const [items, setItems] = useState<InformationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    safeFetch<ApiResponse>({
      url: '/_api/pg_informations',
      signal: controller.signal,
    })
      .then((data) => {
        const sorted = [...data.value].sort(
          (a, b) => new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
        );
        setItems(sorted);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load information.');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of our application.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && <InformationFeed items={items} />}
    </div>
  );
};

export default Home;
