import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider } from '@/context/AppContext';
import { RouterProvider, useRouter } from '@/context/RouterContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import BrowsePage from '@/pages/BrowsePage';
import DetailsPage from '@/pages/DetailsPage';
import PostPage from '@/pages/PostPage';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import FavoritesPage from '@/pages/FavoritesPage';
import SettingsPage from '@/pages/SettingsPage';

function Pages() {
  const { route } = useRouter();

  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'browse':
      return <BrowsePage />;
    case 'details':
      return <DetailsPage id={route.id} />;
    case 'post':
      return <PostPage />;
    case 'auth':
      return <AuthPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'favorites':
      return <FavoritesPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Pages />
            </main>
            <Footer />
          </div>
        </RouterProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
