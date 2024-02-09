import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../constants';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { authenticatedGet } from '../axios';

function Dashboard() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate(RoutePath.ROOT);
  }, [isSignedIn]);

  const [path, setPath] = useState('');
  const [data, setData] = useState([]);
  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await authenticatedGet<any>(
                path,
                (await getToken()) || '',
                navigate,
              );
              setData(res.data);
            }}
          >
            api/v1
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              style={{ width: '400px' }}
            />
            <button type="submit">Submit</button>
          </form>
          {/* <pre>{JSON.stringify(data, undefined, 2)}</pre> */}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
