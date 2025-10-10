import { useEffect, useState } from 'react';
import { auth } from './lib/firebase';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">MyMindmap</h1>
      <p className="mb-8 text-xl text-gray-600">Firebase Web Application</p>

      {user ? (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="mb-2 text-gray-700">
            Welcome, <span className="font-semibold">{user.email}</span>
          </p>
          <button
            onClick={() => auth.signOut()}
            className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-gray-700">Not authenticated</p>
          <p className="mt-2 text-sm text-gray-500">
            Authentication will be implemented in Task 3.0
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">✅ Task 2.0 Complete</p>
        <p className="text-sm text-gray-500">React + Vite + TypeScript + Firebase</p>
      </div>
    </div>
  );
}

export default App;
