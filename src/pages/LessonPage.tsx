import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, CheckCircle, BookOpen, Code2, Target, Clock, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { curriculum } from '../data/curriculum';
import CodeEditor from '../components/CodeEditor';

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, updateProgress } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'example' | 'challenge'>('theory');

  const module = curriculum.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  const lessonIdx = module?.lessons.findIndex(l => l.id === lessonId) || 0;

  useEffect(() => {
    if (user && moduleId && lesson) {
      const completed = user.progress[moduleId]?.lessons[lesson.id] || false;
      setIsCompleted(completed);
    }
  }, [user, moduleId, lesson]);

  if (!module || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested lesson could not be found.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (user && moduleId) {
      updateProgress(moduleId, lesson.id);
      setIsCompleted(true);
    }
  };

  const handleNextLesson = () => {
    const nextLessonIdx = lessonIdx + 1;
    if (nextLessonIdx < module.lessons.length) {
      const nextLesson = module.lessons[nextLessonIdx];
      navigate(`/module/${moduleId}/lesson/${nextLesson.id}`);
    } else {
      const currentModuleIdx = curriculum.findIndex(m => m.id === moduleId);
      if (currentModuleIdx < curriculum.length - 1) {
        const nextModule = curriculum[currentModuleIdx + 1];
        navigate(`/module/${nextModule.id}/lesson/${nextModule.lessons[0].id}`);
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handlePrevLesson = () => {
    const prevLessonIdx = lessonIdx - 1;
    if (prevLessonIdx >= 0) {
      const prevLesson = module.lessons[prevLessonIdx];
      navigate(`/module/${moduleId}/lesson/${prevLesson.id}`);
    } else {
      const currentModuleIdx = curriculum.findIndex(m => m.id === moduleId);
      if (currentModuleIdx > 0) {
        const prevModule = curriculum[currentModuleIdx - 1];
        const lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
        navigate(`/module/${prevModule.id}/lesson/${lastLesson.id}`);
      }
    }
  };

  const moduleProgress = user?.progress[moduleId];
  const completedCount = moduleProgress?.completed || 0;
  const totalCount = moduleProgress?.total || module.lessons.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                to={`/module/${moduleId}`}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to {module.title}</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>Lesson {lessonIdx + 1} of {module.lessons.length}</span>
              </div>
              {isCompleted && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
              <Link
                to={`/focus/module/${moduleId}/lesson/${lesson.id}`}
                className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium"
              >
                Focus Mode
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center text-2xl`}>
                {module.icon}
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">{module.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Lesson {lessonIdx + 1}</p>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {lesson.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              {lesson.description}
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lesson.difficulty === 'beginner' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : lesson.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Module Progress
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${module.color} h-3 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 m-6 rounded-xl">
              <button
                onClick={() => setActiveTab('theory')}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                  activeTab === 'theory'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Theory
              </button>
              <button
                onClick={() => setActiveTab('example')}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                  activeTab === 'example'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                }`}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Example
              </button>
              <button
                onClick={() => setActiveTab('challenge')}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                  activeTab === 'challenge'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                }`}
              >
                <Target className="w-4 h-4 mr-2" />
                Challenge
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-6 pb-6">
              {activeTab === 'theory' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What you'll learn</h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    {lesson.content.theory}
                  </div>
                </div>
              )}

              {activeTab === 'example' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Code Example</h3>
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-6 mb-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
                      <code>{lesson.content.examples?.[0] || ''}</code>
                    </pre>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Try modifying this example in the code editor to see how it works!
                  </p>
                </div>
              )}

              {activeTab === 'challenge' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Practice Challenge</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                      {lesson.content.challenge.title}
                    </h4>
                    <p className="text-purple-800 dark:text-purple-200">
                      {lesson.content.challenge.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white">Interactive Code Editor</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Practice what you've learned by writing code
              </p>
            </div>
            <div className="p-6">
              <CodeEditor 
                initialCode={
                  activeTab === 'challenge' 
                    ? lesson.content.challenge.starterCode 
                    : lesson.content.examples?.[0] || ''
                }
                language={moduleId === 'css' ? 'css' : moduleId === 'javascript' ? 'javascript' : 'html'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevLesson}
              disabled={lessonIdx === 0 && curriculum.findIndex(m => m.id === moduleId) === 0}
              className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous Lesson
            </button>

            <div className="flex items-center space-x-4">
              {!isCompleted && (
                <button
                  onClick={handleMarkComplete}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark as Complete
                </button>
              )}
              
              <button
                onClick={handleNextLesson}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Next Lesson
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
