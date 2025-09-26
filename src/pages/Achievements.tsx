import React from 'react';
import { Trophy, Target, Zap, Star, Award, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Achievements: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const completedLessons = Object.values(user.progress).reduce((acc, progress) => acc + progress.completed, 0);

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: Target,
      color: 'from-green-400 to-emerald-500',
      xp: 50,
      earned: true,
      earnedDate: '2024-12-01'
    },
    {
      id: 2,
      title: 'Quick Starter',
      description: 'Complete 3 lessons in one day',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      xp: 100,
      earned: true,
      earnedDate: '2024-12-02'
    },
    {
      id: 3,
      title: 'HTML Foundations',
      description: 'Complete 5 HTML lessons',
      icon: Trophy,
      color: 'from-orange-400 to-red-500',
      xp: 200,
      earned: completedLessons >= 5,
      earnedDate: completedLessons >= 5 ? '2024-12-03' : null
    },
    {
      id: 4,
      title: 'CSS Stylist',
      description: 'Complete 5 CSS lessons',
      icon: Star,
      color: 'from-blue-400 to-purple-500',
      xp: 200,
      earned: false,
      earnedDate: null
    },
    {
      id: 5,
      title: 'Code Warrior',
      description: 'Complete 25 lessons',
      icon: Award,
      color: 'from-purple-400 to-pink-500',
      xp: 500,
      earned: completedLessons >= 25,
      earnedDate: null
    },
    {
      id: 6,
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: Zap,
      color: 'from-red-400 to-pink-500',
      xp: 300,
      earned: true,
      earnedDate: '2024-12-05'
    },
    {
      id: 7,
      title: 'Module Master',
      description: 'Complete an entire module',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      xp: 1000,
      earned: false,
      earnedDate: null
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalXP = earnedAchievements.reduce((acc, achievement) => acc + achievement.xp, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Achievements 🏆
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your learning milestones and celebrate your progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {earnedAchievements.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Achievements Earned
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalXP}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total XP Earned
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((earnedAchievements.length / achievements.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completion Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
              achievement.earned
                ? 'ring-2 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 transform hover:-translate-y-1'
                : 'opacity-60 hover:opacity-80'
            }`}
          >
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                achievement.earned ? 'animate-pulse' : ''
              }`}>
                <achievement.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className={`text-lg font-bold mb-2 ${
                achievement.earned
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {achievement.title}
              </h3>
              
              <p className={`text-sm mb-4 ${
                achievement.earned
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                {achievement.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                  achievement.earned
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <Star className="w-3 h-3" />
                  <span>{achievement.xp} XP</span>
                </div>
                
                {achievement.earned && achievement.earnedDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(achievement.earnedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {achievement.earned && (
                <div className="mt-3 inline-flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  <Trophy className="w-3 h-3" />
                  <span>Unlocked!</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Message */}
      <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">Keep Learning! 🚀</h2>
        <p className="text-purple-100 mb-4">
          You're doing great! Complete more lessons to unlock new achievements and earn XP.
        </p>
        <div className="text-sm text-purple-200">
          Next milestone: {achievements.find(a => !a.earned)?.title || 'All achievements unlocked!'}
        </div>
      </div>
    </div>
  );
};

export default Achievements;