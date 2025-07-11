import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			scale: 1.2,
			warn: true,
		}),
	],
	theme: {
		colors: {
			// 小清新配色方案
			primary: {
				50: '#f0f9ff',
				100: '#e0f2fe',
				200: '#bae6fd',
				300: '#7dd3fc',
				400: '#38bdf8',
				500: '#0ea5e9',
				600: '#0284c7',
				700: '#0369a1',
				800: '#075985',
				900: '#0c4a6e',
			},
			mint: {
				50: '#f0fdfa',
				100: '#ccfbf1',
				200: '#99f6e4',
				300: '#5eead4',
				400: '#2dd4bf',
				500: '#14b8a6',
				600: '#0d9488',
				700: '#0f766e',
				800: '#115e59',
				900: '#134e4a',
			},
			rose: {
				50: '#fff1f2',
				100: '#ffe4e6',
				200: '#fecdd3',
				300: '#fda4af',
				400: '#fb7185',
				500: '#f43f5e',
				600: '#e11d48',
				700: '#be123c',
				800: '#9f1239',
				900: '#881337',
			},
			amber: {
				50: '#fffbeb',
				100: '#fef3c7',
				200: '#fde68a',
				300: '#fcd34d',
				400: '#fbbf24',
				500: '#f59e0b',
				600: '#d97706',
				700: '#b45309',
				800: '#92400e',
				900: '#78350f',
			},
		},
		animation: {
			'fade-in': 'fadeIn 0.3s ease-out',
			'slide-up': 'slideUp 0.3s ease-out',
			'slide-down': 'slideDown 0.3s ease-out',
			'scale-in': 'scaleIn 0.2s ease-out',
			'bounce-in': 'bounceIn 0.5s ease-out',
		},
	},
	rules: [
		// 自定义动画规则
		[/^animate-fade-in$/, () => ({
			animation: 'fadeIn 0.3s ease-out',
		})],
		[/^animate-slide-up$/, () => ({
			animation: 'slideUp 0.3s ease-out',
		})],
		[/^animate-slide-down$/, () => ({
			animation: 'slideDown 0.3s ease-out',
		})],
		[/^animate-scale-in$/, () => ({
			animation: 'scaleIn 0.2s ease-out',
		})],
		[/^animate-bounce-in$/, () => ({
			animation: 'bounceIn 0.5s ease-out',
		})],
	],
	shortcuts: {
		// 基础组件
		'btn': 'px-4 py-2 rounded-xl font-medium transition-all duration-200 ease-out transform hover:scale-105 active:scale-95',
		'btn-primary': 'btn bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700',
		'btn-secondary': 'btn bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:from-gray-200 hover:to-gray-300',
		'btn-mint': 'btn bg-gradient-to-r from-mint-500 to-mint-600 text-white shadow-lg hover:shadow-xl hover:from-mint-600 hover:to-mint-700',
		'btn-rose': 'btn bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-rose-700',
		
		// 卡片组件
		'card': 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-200 hover:shadow-xl hover:bg-white/90',
		'card-glass': 'bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6',
		
		// 输入框
		'input': 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 bg-white/80 backdrop-blur-sm',
		'input-glass': 'w-full px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 bg-white/60 backdrop-blur-md',
		
		// 布局
		'layout-container': 'min-h-screen bg-gradient-to-br from-blue-50 via-mint-50 to-rose-50',
		'header': 'bg-white/80 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-50',
		'main-content': 'flex-1 p-4 md:p-6',
		
		// 文本样式
		'text-gradient': 'bg-gradient-to-r from-primary-600 to-mint-600 bg-clip-text text-transparent',
		'text-muted': 'text-gray-600/80',
		
		// 状态标签
		'tag': 'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
		'tag-primary': 'tag bg-primary-100 text-primary-700',
		'tag-mint': 'tag bg-mint-100 text-mint-700',
		'tag-rose': 'tag bg-rose-100 text-rose-700',
		'tag-amber': 'tag bg-amber-100 text-amber-700',
	},
}); 