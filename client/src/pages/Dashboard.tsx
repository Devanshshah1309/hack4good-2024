import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../constants';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authenticatedGet } from '../axios';

function Dashboard() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate(RoutePath.ROOT);
  }, [isSignedIn]);

  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          api.com/admin/volunteers
          <input
            placeholder="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '400px' }}
          />
          <button
            onClick={async () => {
              const res = await authenticatedGet<any[]>(
                '/admin/volunteers' + query,
                (await getToken()) || '',
                navigate,
              );
              setData(res.data);
            }}
          >
            Go
          </button>
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
