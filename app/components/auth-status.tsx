'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function AuthStatus() {
    const { ready, authenticated, user, login, logout } = usePrivy();

    if (!ready) {
        return <div className="p-4">Loading Privy...</div>;
    }

    if (authenticated && user) {
        return (
            <div className="flex flex-col gap-4 p-4 border rounded-lg border-gray-200">
                <h2 className="text-xl font-bold">Privy is Ready!</h2>
                <p className="text-green-600">User is logged in</p>
                <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                    <p>ID: {user.id.slice(0, 10)}...</p>
                    <p>Wallet: {user.wallet ? user.wallet.address : 'None'}</p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-fit"
                >
                    Log out
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg border-gray-200">
            <h2 className="text-xl font-bold">Privy is Ready!</h2>
            <p className="text-gray-600">User is NOT logged in</p>
            <button
                onClick={login}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-fit"
            >
                Log in
            </button>
        </div>
    );
}
