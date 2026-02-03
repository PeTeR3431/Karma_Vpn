import { useEffect, useState } from 'react';
import { Search, UserCheck, UserX, Crown, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import api from '../lib/api';
import clsx from 'clsx';

interface User {
    id: string;
    deviceId: string;
    isActive: boolean;
    isPremium: boolean;
    premiumExpiryDate: string | null;
    lastLoginAt: string;
    createdAt: string;
}

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({ total: 0, premium: 0, free: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/users'),
                api.get('/users/stats/overview')
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const togglePremium = async (user: User) => {
        if (!confirm(`Toggle Premium for ${user.deviceId}?`)) return;
        try {
            await api.patch(`/users/${user.id}`, {
                isPremium: !user.isPremium,
                // Set expiry to 30 days from now if enabling, else null
                premiumExpiryDate: !user.isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
            });
            fetchData();
        } catch (err) {
            alert('Failed to update user');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">User Management</h2>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-surface/50 border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <Search size={24} />
                        </div>
                        <div>
                            <p className="text-secondary text-sm">Total Users</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-surface/50 border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400">
                            <Crown size={24} />
                        </div>
                        <div>
                            <p className="text-secondary text-sm">Premium Users</p>
                            <p className="text-2xl font-bold text-white">{stats.premium}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-surface/50 border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gray-500/20 text-gray-400">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <p className="text-secondary text-sm">Free Users</p>
                            <p className="text-2xl font-bold text-white">{stats.free}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-secondary text-sm font-medium uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Device ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-white/80">
                                    {user.deviceId}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={clsx(
                                        "px-2 py-1 rounded-full text-xs font-bold w-fit",
                                        user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                    )}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.isPremium ? (
                                        <div className="flex items-center gap-2 text-yellow-400">
                                            <Crown size={16} />
                                            <span className="font-bold">Premium</span>
                                        </div>
                                    ) : (
                                        <span className="text-secondary">Free Plan</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-secondary text-sm">
                                    {new Date(user.lastLoginAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => togglePremium(user)}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ml-auto",
                                            user.isPremium
                                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                        )}
                                    >
                                        <Crown size={14} />
                                        {user.isPremium ? 'Remove Premium' : 'Gift Premium'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
