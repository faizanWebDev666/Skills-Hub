import React, { useEffect, useState } from 'react';

export default function CallHistory() {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, missed, recent
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchCallHistory();
        fetchCallStatistics();
    }, []);

    const fetchCallHistory = async () => {
        try {
            const response = await fetch(route('calls.history'));
            const data = await response.json();

            if (data.success) {
                setCalls(data.calls);
            }
        } catch (error) {
            console.error('Failed to fetch call history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCallStatistics = async () => {
        try {
            const response = await fetch(route('calls.statistics'));
            const data = await response.json();

            if (data.success) {
                setStats(data.statistics);
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const getFilteredCalls = () => {
        if (filter === 'missed') {
            return calls.filter(call => call.status === 'missed');
        }
        return calls;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

        return date.toLocaleDateString();
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            missed: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-gray-100 text-gray-800',
        };

        return statusStyles[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (call) => {
        if (call.is_incoming) {
            return call.status === 'missed' ? (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2.101a1 1 0 01.95.69l1.068 3.202a1 1 0 01-.727 1.22l-.857.143a11 11 0 006.519 6.532l.143-.857a1 1 0 011.22-.727l3.2 1.067a1 1 0 01.69.95V17a2 2 0 01-2 2h-1C9.716 19 3 12.284 3 4V3a2 2 0 012-2h1z"></path>
                </svg>
            ) : (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.02 1.004 1.986 1.722 2.8 1.952 2.286 4.649 3.84 7.641 3.84 1.545 0 3.032-.25 4.434-.726l.772-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2.5C6.716 18 2 13.284 2 7.5V3z"></path>
                </svg>
            );
        }

        return (
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.02 1.004 1.986 1.722 2.8 1.952 2.286 4.649 3.84 7.641 3.84 1.545 0 3.032-.25 4.434-.726l.772-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2.5C6.716 18 2 13.284 2 7.5V3z"></path>
            </svg>
        );
    };

    const filteredCalls = getFilteredCalls();

    return (
        <div className="call-history bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Call History</h2>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm font-medium">Total Calls</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.total_calls}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm font-medium">Total Duration</p>
                        <p className="text-lg font-bold text-green-600">{stats.total_duration_formatted}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm font-medium">Missed Calls</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.missed_calls}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm font-medium">Avg Duration</p>
                        <p className="text-lg font-bold text-purple-600">{Math.floor(stats.average_duration / 60)}m {stats.average_duration % 60}s</p>
                    </div>
                </div>
            )}

            {/* Filter buttons */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filter === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All Calls
                </button>
                <button
                    onClick={() => setFilter('missed')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filter === 'missed'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Missed
                </button>
            </div>

            {/* Calls list */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block">
                        <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                </div>
            ) : filteredCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No calls to display</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCalls.map((call) => (
                        <div key={call.uuid} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(call)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900">{call.other_user?.name}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(call.status)}`}>
                                            {call.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{formatTime(call.started_at || call.created_at)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{call.formatted_duration}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
