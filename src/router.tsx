import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/Layout';
import Home from '@/pages/Home';
import NotFoundPage from '@/pages/NotFoundPage';
import Profile from '@/pages/Profile/Profile';
import Privacy from '@/pages/Privacy/Privacy';
import Film from '@/pages/Film/Film';

export const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <Layout />,
			children: [
				{ path: '*', element: <NotFoundPage /> },
				{ index: true, element: <Home /> },
				{ path: '/profile', element: <Profile /> },
				{ path: '/privacy', element: <Privacy /> },
				{ path: '/films/film/:id', element: <Film /> },
			],
		},
	],
	{ basename: '/kinomemory' },
);
