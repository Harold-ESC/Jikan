import LoginScreen from './core/LoginScreen';
import JikanApp from './JikanApp';
import { useSession } from './hooks/useSession';

export default function App() {
  const { user, loading } = useSession();

  if (loading) {
    return null;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <JikanApp user={user} />;
}
