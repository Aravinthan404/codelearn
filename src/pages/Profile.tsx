import React, { useState } from 'react';
import { User, Mail, Calendar, Trophy, Target, Zap, Settings, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { curriculum } from '../data/curriculum';
import ProgressBar from '../components/ProgressBar';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');

  if (!user) return null;

  const totalLessons = curriculum.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = Object.values(user.progress).reduce((acc, progress) => acc + progress.completed, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true },
    { id: 2, title: 'HTML Hero', description: 'Complete HTML module', icon: '🏗️', earned: completedLessons >= 8 },
    { id: 3, title: 'Style Master', description: 'Complete CSS module', icon: '🎨', earned: false },
    { id: 4, title: 'Code Warrior', description: 'Complete 50 lessons', icon: '⚔️', earned: false },
    { id: 5, title: 'Streak Master', description: 'Maintain 30-day streak', icon: '🔥', earned: false },
    { id: 6, title: 'Project Builder', description: 'Complete 10 challenges', icon: '🚀', earned: false }
  ];

  const stats = [
    { label: 'Lessons Completed', value: completedLessons, icon: Target, color: 'text-blue-600' },
    { label: 'Current Streak', value: '7 days', icon: Zap, color: 'text-yellow-600' },
    { label: 'Total XP', value: `${completedLessons * 50} XP`, icon: Trophy, color: 'text-purple-600' },
    { label: 'Modules Started', value: Object.keys(user.progress).length, icon: User, color: 'text-green-600' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-start space-x-6">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {user.name}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300 mb-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Joined December 2024</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <ProgressBar
                current={completedLessons}
                total={totalLessons}
                color="from-purple-500 to-blue-500"
                size="md"
                showLabel={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Module Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Module Progress
            </h3>
            <div className="space-y-4">
              {curriculum.map((module) => {
                const progress = user.progress[module.id];
                const progressPercentage = progress ? (progress.completed / progress.total) * 100 : 0;
                
                return (
                  <div key={module.id} className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center text-xl`}>
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {module.title}
                        </h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {progress?.completed || 0}/{progress?.total || 0}
                        </span>
                      </div>
                      <ProgressBar
                        current={progress?.completed || 0}
                        total={progress?.total || module.lessons.length}
                        color={module.color}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all ${
                achievement.earned
                  ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                  : 'opacity-60'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-3 ${achievement.earned ? 'animate-bounce' : ''}`}>
                  {achievement.icon}
                </div>
                <h3 className={`font-bold mb-2 ${
                  achievement.earned
                    ? 'text-yellow-800 dark:text-yellow-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm ${
                  achievement.earned
                    ? 'text-yellow-700 dark:text-yellow-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-3 inline-flex items-center space-x-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                    <Trophy className="w-3 h-3" />
                    <span>Earned</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Account Settings
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                readOnly
              />
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={logout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;