import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code, 
  Palette, 
  Zap, 
  Layers, 
  Globe, 
  ArrowRight, 
  Database,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { curriculum } from '../data/curriculum';

const moduleIcons = {
  html: Code,
  css: Palette,
  javascript: Zap,
  react: Layers,
  apis: Globe,
  nextjs: ArrowRight,
  sql: Database
};

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedModules, setExpandedModules] = useState<string[]>(['html']);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonStatus = (moduleId: string, lessonIndex: number) => {
    if (!user) return 'locked';
    
    // For demo purposes, mark first lesson of each module as available
    if (lessonIndex === 0) return 'available';
    
    // Mock completion logic - in real app, this would come from user progress
    const completedLessons = user.progress?.completedLessons || [];
    const lessonId = `${moduleId}-${lessonIndex}`;
    
    if (completedLessons.includes(lessonId)) return 'completed';
    
    // Check if previous lesson is completed
    const prevLessonId = `${moduleId}-${lessonIndex - 1}`;
    if (lessonIndex === 0 || completedLessons.includes(prevLessonId)) {
      return 'available';
    }
    
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'available':
        return <Circle className="w-4 h-4 text-blue-500" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">CodeLearn</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Web Development</p>
          </div>
        </Link>

        <nav className="space-y-2">
          {curriculum.map((module) => {
            const Icon = moduleIcons[module.id as keyof typeof moduleIcons];
            const isExpanded = expandedModules.includes(module.id);
            const isCurrentModule = location.pathname.includes(`/module/${module.id}`);
            
            return (
              <div key={module.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/module/${module.id}`}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors flex-1 ${
                      isCurrentModule
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{module.title}</span>
                  </Link>
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="ml-8 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {module.lessons.map((lesson, index) => {
                      const status = getLessonStatus(module.id, index);
                      const isCurrentLessonByIndex = location.pathname === `/lesson/${module.id}/${index}`;
                      const isCurrentLessonById = location.pathname === `/module/${module.id}/lesson/${lesson.id}`;

                      return (
                        <Link
                          key={index}
                          to={status !== 'locked' ? `/module/${module.id}/lesson/${lesson.id}` : '#'}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            isCurrentLessonByIndex || isCurrentLessonById
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : status === 'locked'
                              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {getStatusIcon(status)}
                          <span className="flex-1">
                            {index + 1}. {lesson.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}