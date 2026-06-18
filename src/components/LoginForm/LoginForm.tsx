import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../context/AuthContext/useAuth';
import { useModalContext } from '@/context/ModalContext/useModalContext';
import { FormLoginType } from '../../types/FormLoginType.ts';

import './LoginForm.scss';

export default function LoginForm() {
	const { user, login } = useAuth();
	const modal = useModalContext();

	const [status, setStatus] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			login: 'user',
			password: 'qwerty',
		},
	});

	// console.log(login);

	async function onSubmit(data: FormLoginType) {
		// console.log(data);
		setStatus('loading');

		const success = await login(data.login, data.password);

		if (success) {
			setStatus('success');
			setTimeout(() => {
				reset();
				modal.close();
			}, 1000);
		} else {
			setStatus('error');
		}
	}

	return (
		<form
			className={status === 'loading' ? 'login-form sending' : 'login-form'}
			onSubmit={handleSubmit(onSubmit)}>
			<div className="login-field">
				<label className="login-label">Login</label>
				<input
					{...register('login', {
						required: 'Field required',
					})}
					type="text"
					className="login-input"
					placeholder=""
				/>
				{errors.login && (
					<div className="error-field">
						{errors.login.message || 'Field is required.'}
					</div>
				)}
			</div>

			<div className="login-field">
				<label className="login-label">Password</label>
				<input
					{...register('password', {
						required: 'Field required',
					})}
					type="password"
					className="login-input"
					placeholder="••••••••"
				/>
				{errors.password && (
					<div className="error-field">
						{errors.password.message || 'Password is required.'}
					</div>
				)}
			</div>

			<button className={`login-button ${isValid ? '' : 'disabled'}`}>Authorize</button>

			{status === 'success' && <p className="success">Success</p>}
			{status === 'error' && <p className="error">Error</p>}
		</form>
	);
}
