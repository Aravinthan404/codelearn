import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Trophy, Target, TrendingUp, BookOpen, Code, Zap } from 'lucide-react';
import { curriculum } from '../data/curriculum';
import { useAuth } from '../contexts/AuthContext';
import ProgressBar from '../components/ProgressBar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const totalLessons = curriculum.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = Object.values(user.progress).reduce((acc, progress) => acc + progress.completed, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const stats = [
    {
      label: 'Lessons Completed',
      value: completedLessons,
      total: totalLessons,
      icon: BookOpen,
      color: 'from-green-400 to-emerald-500'
    },
    {
      label: 'Current Streak',
      value: 7,
      unit: 'days',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      label: 'Total XP',
      value: completedLessons * 50,
      unit: 'XP',
      icon: Target,
      color: 'from-purple-400 to-pink-500'
    },
    {
      label: 'Rank',
      value: 'Intermediate',
      icon: Trophy,
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Ready to continue your coding journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}{stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
                {stat.total && <span className="text-sm text-gray-500">/{stat.total}</span>}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Overall Progress</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(overallProgress)}% Complete
          </span>
        </div>
        <ProgressBar 
          current={completedLessons} 
          total={totalLessons} 
          color="from-purple-500 to-blue-500"
          size="lg"
        />
      </div>

      {/* Curriculum Modules */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Learning Path</h2>
          <Link
            to="/achievements"
            className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            <span>View Achievements</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.map((module) => {
            const progress = user.progress[module.id];
            const progressPercentage = progress ? (progress.completed / progress.total) * 100 : 0;
            const isStarted = progress && progress.completed > 0;
            const isCompleted = progress && progress.completed === progress.total;

            return (
              <Link
                key={module.id}
                to={`/module/${module.id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {module.icon}
                  </div>
                  {isCompleted && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {module.description}
                </p>

                <div className="space-y-3">
                  <ProgressBar
                    current={progress?.completed || 0}
                    total={progress?.total || module.lessons.length}
                    color={module.color}
                    size="sm"
                    showLabel={false}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {progress?.completed || 0} of {progress?.total || module.lessons.length} lessons
                    </span>
                    {isStarted && !isCompleted && (
                      <div className="flex items-center text-purple-600 dark:text-purple-400">
                        <Play className="w-4 h-4 mr-1" />
                        Continue
                      </div>
                    )}
                    {!isStarted && (
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Start
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center text-green-500">
                        <Trophy className="w-4 h-4 mr-1" />
                        Complete
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Keep the momentum going! 🚀</h3>
            <p className="text-purple-100 mb-4">
              You're doing great! Complete one more lesson today to maintain your streak.
            </p>
            <Link
              to={`/module/html`}
              className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <Code className="w-5 h-5 mr-2" />
              Continue Learning
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Code className="w-16 h-16 text-white/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;