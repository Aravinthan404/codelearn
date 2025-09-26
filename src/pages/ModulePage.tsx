import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, CheckCircle, Lock, BookOpen, Target, Award } from 'lucide-react';
import { curriculum } from '../data/curriculum';
import { useAuth } from '../contexts/AuthContext';
import ProgressBar from '../components/ProgressBar';

const ModulePage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();

  const module = curriculum.find(m => m.id === moduleId);
  const progress = user?.progress[moduleId!];

  if (!module) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Module not found</h1>
      </div>
    );
  }

  const progressPercentage = progress ? (progress.completed / progress.total) * 100 : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Module Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-start space-x-6">
          <div className={`w-20 h-20 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center text-3xl`}>
            {module.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {module.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
              {module.description}
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {module.lessons.length} Lessons
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ~{module.lessons.length * 15} minutes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Beginner to Intermediate
                </span>
              </div>
            </div>

            <ProgressBar
              current={progress?.completed || 0}
              total={progress?.total || module.lessons.length}
              color={module.color}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Award className="w-4 h-4" />
            <span>{module.lessons.length} Lessons</span>
          </div>
        </div>
        
        {module.lessons.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Coming Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're working hard to create amazing content for this module. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {module.lessons.map((lesson, index) => {
              const isCompleted = progress?.lessons[lesson.id] || false;
              const isUnlocked = index === 0 || (progress?.lessons[module.lessons[index - 1].id]);
              
              return (
                <div
                  key={lesson.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border transition-all duration-300 ${
                    isUnlocked ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-60'
                  } ${
                    isCompleted ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[60px]">
                        Lesson {index + 1}
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isUnlocked 
                            ? `bg-gradient-to-r ${module.color} text-white`
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : isUnlocked ? (
                          <Play className="w-6 h-6" />
                        ) : (
                          <Lock className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${
                          isUnlocked 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {lesson.title}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          isUnlocked 
                            ? 'text-gray-600 dark:text-gray-300' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {lesson.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs">
                          <span className={`flex items-center space-x-1 ${
                            isUnlocked 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lesson.difficulty === 'beginner' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : lesson.difficulty === 'intermediate'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {isUnlocked && (
                      <Link
                        to={`/module/${moduleId}/lesson/${lesson.id}`}
                        className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : `bg-gradient-to-r ${module.color} text-white hover:shadow-lg`
                        }`}
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Link>
                    )}
                    
                    {!isUnlocked && (
                      <div className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Next Steps */}
      {module.lessons.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Start Learning?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Begin with the first lesson and work your way through the module at your own pace.
          </p>
          <Link
            to={`/module/${moduleId}/lesson/${module.lessons[0].id}`}
            className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${module.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105`}
          >
            <Play className="w-5 h-5 mr-2" />
            Start First Lesson
          </Link>
        </div>
      )}
    </div>
  );
};

export default ModulePage;