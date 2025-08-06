'use client';

import { useState } from 'react';
import { Search, BookOpen, TrendingUp, Users, Star, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  GoMath
                </h1>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  기출문제
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  시각화 도구
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  학습 진도
                </a>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  시작하기
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              수학을{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                시각적으로
              </span>{' '}
              학습하세요
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              기출문제와 인터랙티브 시각화를 통해 수학의 본질을 이해하고,
              AI가 생성한 유사문제로 실력을 향상시키세요.
            </p>
            
            {/* Search Bar */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="문제를 검색해보세요... (예: 미분, 적분, 확률)"
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  검색
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-16">
              왜 GoMath인가요?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: '풍부한 기출문제',
                description: '수능부터 공무원까지 다양한 시험의 기출문제를 제공합니다.',
                color: 'text-blue-600 bg-blue-50',
              },
              {
                icon: TrendingUp,
                title: 'AI 유사문제 생성',
                description: '학습한 문제와 유사한 새로운 문제를 AI가 자동으로 생성합니다.',
                color: 'text-green-600 bg-green-50',
              },
              {
                icon: Users,
                title: '시각적 학습',
                description: '그래프와 애니메이션으로 수학 개념을 직관적으로 이해합니다.',
                color: 'text-purple-600 bg-purple-50',
              },
              {
                icon: Star,
                title: '개인맞춤 학습',
                description: '학습 패턴을 분석하여 맞춤형 학습 경로를 제공합니다.',
                color: 'text-orange-600 bg-orange-50',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h4>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            지금 시작해보세요
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            무료로 회원가입하고 수학 학습의 새로운 경험을 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center">
              무료 시작하기
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              데모 보기
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-white mb-4">GoMath</h4>
            <p className="text-gray-400 mb-8">수학을 시각적으로, 직관적으로</p>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-sm text-gray-500">
                © 2024 GoMath. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}