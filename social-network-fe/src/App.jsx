import { AppRouter } from './router/AppRouter'
import { AppContext } from './context/AppContext';
import { useState } from 'react';

function App() {
  const [userCtx, setUserCtx] = useState({});
  const [loadingCtx, setLoadingCtx] = useState(true);
  const [refreshDataCtx, setRefreshDataCtx] = useState(true);
  const [isAuthenticatedCtx, setIsAuthenticatedCtx] = useState(false);

  return (
    <div className='layout'>
      <AppContext.Provider value={ { userCtx, setUserCtx, loadingCtx, setLoadingCtx, refreshDataCtx, setRefreshDataCtx, isAuthenticatedCtx, setIsAuthenticatedCtx } }>
        <AppRouter />
      </AppContext.Provider>
    </div>
  )
}

export default App
