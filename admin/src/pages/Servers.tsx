import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Power, Globe, Server as ServerIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import api from '../lib/api';
import clsx from 'clsx';

interface Server {
    id: string;
    name: string;
    countryCode: string;
    city: string;
    ipAddress: string;
    capacity: number;
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
}

export function Servers() {
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        countryCode: '',
        city: '',
        ipAddress: '',
        publicKey: 'placeholder-key',
        capacity: 100,
        status: 'ONLINE'
    });

    const fetchServers = async () => {
        try {
            const res = await api.get('/servers');
            setServers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/servers', formData);
            setShowAddForm(false);
            fetchServers();
            // Reset form
            setFormData({ ...formData, name: '', city: '', ipAddress: '' });
        } catch (err) {
            alert('Failed to add server');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this server?')) return;
        try {
            await api.delete(`/servers/${id}`);
            fetchServers();
        } catch (err) {
            alert('Failed to delete server');
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await api.patch(`/servers/${id}/status`);
            fetchServers();
        } catch (err) {
            alert('Failed to update server status');
        }
    };

    return (
        <div className="space-y-6">
            {/* ... header and add button ... */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Server Nodes</h2>
                    <p className="text-secondary mt-1">Manage network infrastructure</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    Add Node
                </button>
            </div>

            {/* Add Server Form */}
            {showAddForm && (
                <Card className="mb-8 border-primary/20 bg-primary/5">
                    <h3 className="text-xl font-bold mb-4 text-white">Add New Server</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Server Name (e.g. US East 1)"
                            className="bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Country Code (e.g. US)"
                            className="bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                            value={formData.countryCode}
                            onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                            required
                        />
                        <input
                            placeholder="City (e.g. New York)"
                            className="bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                            required
                        />
                        <input
                            placeholder="IP Address"
                            className="bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                            value={formData.ipAddress}
                            onChange={e => setFormData({ ...formData, ipAddress: e.target.value })}
                            required
                        />
                        <div className="col-span-2 flex justify-end gap-3 mt-2">
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-secondary hover:text-white">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-primary text-background font-bold rounded-lg">Save Server</button>
                        </div>
                    </form>
                </Card>
            )}

            <Card className="overflow-hidden p-0">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-secondary text-sm font-medium uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">IP Address</th>
                            <th className="px-6 py-4">Load</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {servers.map((server) => (
                            <tr key={server.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className={clsx(
                                        "flex items-center gap-2 px-3 py-1 rounded-full w-fit text-xs font-bold",
                                        server.status === 'ONLINE' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                    )}>
                                        <div className={clsx("w-2 h-2 rounded-full", server.status === 'ONLINE' ? "bg-green-400" : "bg-red-400")} />
                                        {server.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-secondary">
                                        <ServerIcon size={16} />
                                    </div>
                                    {server.name}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">{getErrorFlag(server.countryCode)}</span>
                                        {server.city}, {server.countryCode}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-mono text-sm">{server.ipAddress}</td>
                                <td className="px-6 py-4">
                                    <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${Math.random() * 80 + 10}%` }} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 text-secondary">
                                        <button
                                            onClick={() => handleToggleStatus(server.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Toggle Status"
                                        >
                                            <Power size={18} className={server.status !== 'ONLINE' ? "text-red-400" : "text-green-400"} />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(server.id)} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {servers.length === 0 && !isLoading && (
                    <div className="p-12 text-center text-secondary">No servers found. Add one above.</div>
                )}
            </Card>
        </div>
    );
}

// Simple utility to show emoji flag (browser/os dependent)
function getErrorFlag(countryCode: string) {
    // Actually we can just show the text code if emoji is tricky without a lib
    // Simple mock emoji mapping or fallback
    return "🌍";
}
