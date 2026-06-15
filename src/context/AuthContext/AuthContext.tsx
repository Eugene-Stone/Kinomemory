import React, { createContext, useState, useEffect, useEffectEvent } from 'react';
import { UserType } from '../../types/UserType';

type User = UserType;

type AuthContextType = {
	user: User | null;
	login: (login: string, password: string) => Promise<boolean>;
	logout: () => void;
};

// const BASE_URL = 'http://localhost:3001';
const BASE_URL = 'https://react-kinomemory.eugenestone-work.workers.dev/'.replace(/\/+$/, '');

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
	const [user, setUser] = useState<User | null>(null);

	const changeUser = useEffectEvent((user: User | null) => {
		setUser(user);
	});

	useEffect(() => {
		const savedUser = localStorage.getItem('user');

		if (savedUser) {
			changeUser(JSON.parse(savedUser));
		}
	}, []);

	const login = async (login: string, password: string) => {
		const res = await fetch(
			`${BASE_URL}/users?login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`,
		);

		if (!res.ok) {
			console.error('Auth request failed', res.status, res.statusText);
			setUser(null);
			localStorage.removeItem('user');
			return false;
		}

		const data = await res.json();

		if (!Array.isArray(data) || data.length === 0) {
			setUser(null);
			localStorage.removeItem('user');
			return false;
		}

		const userData = data.find(
			(userRecord) => userRecord.login === login && userRecord.password === password,
		);

		if (!userData || typeof userData.role !== 'string') {
			setUser(null);
			localStorage.removeItem('user');
			return false;
		}

		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));

		return true;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('user');
	};

	return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export { AuthContext };
