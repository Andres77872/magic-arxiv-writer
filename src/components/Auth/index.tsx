import React, { useState } from 'react';
import './index.css';

type AuthMode = 'login' | 'register';

interface User {
    user_hash: string;
    username: string;
    email: string;
    user_type: string;
    created_at: string | null;
    updated_at: string | null;
}

interface AuthResponse {
    success: boolean;
    message: string;
    session_token: string;
    user: User;
    project: any;
    accessible_projects: any[];
    expires_at: string | null;
}

interface AuthProps {
    showLoginModal: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

// Cookie management utilities
const setCookie = (name: string, value: string, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const Auth: React.FC<AuthProps> = ({
    showLoginModal,
    onClose,
    onLoginSuccess,
}) => {
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });
    const [authError, setAuthError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthError('');

        try {
            // Create form data for the request
            const formData = new FormData();
            formData.append('username', loginForm.username);
            formData.append('password', loginForm.password);

            const response = await fetch('https://auth-v2.arz.ai/auth/login', {
                method: 'POST',
                body: formData,
            });

            const data: AuthResponse = await response.json();

            if (response.ok && data.success) {
                // Check if user type is root
                if (data.user.user_type !== 'root') {
                    setAuthError('Access denied. Only root users are allowed to access this application.');
                    return;
                }

                // Handle session token cookie
                const existingToken = getCookie('session_token');
                if (!existingToken || existingToken !== data.session_token) {
                    setCookie('session_token', data.session_token);
                }

                // Login successful
                onLoginSuccess(data.user);
                closeModal();
            } else {
                // Login failed
                setAuthError(data.message || 'Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setAuthError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        onClose();
        setAuthError('');
        setAuthMode('login');
        setLoginForm({ username: '', password: '' });
        setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
    };

    const switchAuthMode = (mode: AuthMode) => {
        setAuthMode(mode);
        setAuthError('');
    };

    if (!showLoginModal) return null;

    return (
        <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{authMode === 'login' ? '🔐 Sign In' : '📝 Create Account'}</h2>
                    <button className="modal-close" onClick={closeModal} aria-label="Close modal">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {/* Alpha disclaimer */}
                    <div className="alpha-notice">
                        <span className="warning-icon">⚠️</span>
                        <div className="notice-content">
                            <strong>Alpha Version Notice:</strong> This project is currently in alpha development. 
                            Login and registration functionality may change in future updates. User accounts and 
                            data may be deleted without prior notification during development phases.
                        </div>
                    </div>

                    {/* Auth Mode Toggle */}
                    <div className="auth-mode-toggle">
                        <button 
                            className={`mode-button ${authMode === 'login' ? 'active' : ''}`}
                            onClick={() => switchAuthMode('login')}
                        >
                            Sign In
                        </button>
                        <button 
                            className={`mode-button ${authMode === 'register' ? 'active' : ''}`}
                            onClick={() => switchAuthMode('register')}
                        >
                            Register
                        </button>
                    </div>

                    {authError && (
                        <div className="auth-error">
                            <span className="error-icon">❌</span>
                            {authError}
                        </div>
                    )}

                    {authMode === 'login' ? (
                        <form onSubmit={handleLogin} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                                    placeholder="Enter your username"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="auth-submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    '🔐 Sign In'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="reg-username">Username</label>
                                <input
                                    type="text"
                                    id="reg-username"
                                    value={registerForm.username}
                                    onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                                    placeholder="Choose a username"
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-email">Email</label>
                                <input
                                    type="email"
                                    id="reg-email"
                                    value={registerForm.email}
                                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                                    placeholder="Enter your email"
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-password">Password</label>
                                <input
                                    type="password"
                                    id="reg-password"
                                    value={registerForm.password}
                                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                                    placeholder="Create a password"
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-confirm-password">Confirm Password</label>
                                <input
                                    type="password"
                                    id="reg-confirm-password"
                                    value={registerForm.confirmPassword}
                                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                                    placeholder="Confirm your password"
                                    disabled
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="auth-submit-button"
                                disabled={true}
                            >
                                📝 Create Account (Coming Soon)
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}; 