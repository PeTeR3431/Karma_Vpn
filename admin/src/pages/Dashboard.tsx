import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, Users, Server as ServerIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../lib/api';

const StatCard = ({ title, value, change, icon: Icon }: any) => (
    <Card className="relative overflow-hidden">
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-secondary text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={20} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
            <span className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={14} /> {change}
            </span>
            <span className="text-secondary font-normal">vs last week</span>
        </div>
    </Card>
);

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSessions: 0,
        serversOnline: '0/0',
        totalBandwidthBytes: 0,
    });
    const [chartData, setChartData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const [statsRes, chartRes] = await Promise.all([
                api.get('/stats/dashboard'),
                api.get('/stats/chart')
            ]);
            setStats(statsRes.data);
            setChartData(chartRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    useEffect(() => {
        fetchData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-3xl font-bold text-white">My Dashboard</h2>
                    <p className="text-secondary mt-1">Real-time network overview</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="px-4 py-2 bg-primary text-background font-semibold rounded-xl hover:opacity-90 transition-opacity">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} change="+0%" icon={Users} />
                <StatCard title="Active Sessions" value={stats.activeSessions} change="+0%" icon={Activity} />
                <StatCard title="Servers Online" value={stats.serversOnline} change="0%" icon={ServerIcon} />
                <StatCard title="Bandwidth" value={formatBytes(stats.totalBandwidthBytes)} change="+0%" icon={Activity} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Traffic Chart */}
                <div className="lg:col-span-2">
                    <Card title="Traffic Flow" className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#4ade80' }}
                                />
                                <Area type="monotone" dataKey="uv" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Server Load Bar Chart */}
                <div className="lg:col-span-1">
                    <Card title="Server Load" className="h-[400px]">
                        <div className="flex flex-col h-full justify-between pb-8">
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={chartData}>
                                    <Bar dataKey="pv" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="text-center">
                                <p className="text-secondary text-sm">Peak Load</p>
                                <p className="text-2xl font-bold text-white">82%</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
