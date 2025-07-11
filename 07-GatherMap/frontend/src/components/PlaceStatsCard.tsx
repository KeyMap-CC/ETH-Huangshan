import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import type { PlaceStatItem } from '../services/api';

interface PlaceStatsCardProps {
	className?: string;
}

const PlaceStatsCard: React.FC<PlaceStatsCardProps> = ({ className = '' }) => {
	const [stats, setStats] = useState<PlaceStatItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await adminApi.getPlaceStats();
			setStats(response.data);
		} catch (error) {
			console.error('加载统计数据失败:', error);
			setError('加载统计数据失败');
		} finally {
			setLoading(false);
		}
	};

	const getStatCardStyle = (type: string) => {
		switch (type) {
			case 'total':
				return 'bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200/50 text-primary-600';
			case 'open':
				return 'bg-gradient-to-br from-mint-50 to-mint-100 border-mint-200/50 text-mint-600';
			case 'testing':
				return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50 text-amber-600';
			case 'suspected':
				return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 text-purple-600';
			case 'closed':
				return 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200/50 text-rose-600';
			default:
				return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200/50 text-gray-600';
		}
	};

	if (loading) {
		return (
			<div className={`grid grid-cols-2 sm:grid-cols-5 gap-4 ${className}`}>
				{[...Array(5)].map((_, index) => (
					<div key={index} className="p-4 rounded-xl border animate-pulse">
						<div className="h-8 bg-gray-200 rounded mb-2"></div>
						<div className="h-4 bg-gray-200 rounded"></div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className={`text-center py-4 ${className}`}>
				<div className="text-red-600 mb-2">{error}</div>
				<button
					onClick={loadStats}
					className="btn-secondary text-sm"
				>
					重新加载
				</button>
			</div>
		);
	}

	return (
		<div className={`grid grid-cols-2 sm:grid-cols-5 gap-4 ${className}`}>
			{stats.map((stat) => (
				<div
					key={stat.type}
					className={`p-4 rounded-xl border ${getStatCardStyle(stat.type)}`}
				>
					<div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
					<div className="text-xs sm:text-sm">{stat.label}</div>
				</div>
			))}
		</div>
	);
};

export default PlaceStatsCard;