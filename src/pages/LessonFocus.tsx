import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, CheckCircle, Play, Clock, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { curriculum } from '../data/curriculum';
import CodeEditor from '../components/CodeEditor';

const FOCUS_KEY = 'lessonFocusStatus';

const getStoredStatus = (moduleId: string, lessonId: string) => {
  try {
    const raw = localStorage.getItem(FOCUS_KEY);
    if (!raw) return 'not-started' as const;
    const parsed = JSON.parse(raw);
    return (parsed?.[moduleId]?.[lessonId] as 'new' | 'in-progress' | 'completed') || 'not-started';
  } catch {
    return 'not-started' as const;
  }
};

const setStoredStatus = (moduleId: string, lessonId: string, value: 'new' | 'in-progress' | 'completed') => {
  try {
    const raw = localStorage.getItem(FOCUS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const next = {
      ...parsed,
      [moduleId]: {
        ...(parsed[moduleId] || {}),
        [lessonId]: value
      }
    };
    localStorage.setItem(FOCUS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
};

const statusToIcon = (status: 'new' | 'in-progress' | 'completed') => {
  if (status === 'completed') return '✓';
  if (status === 'in-progress') return '🔄';
  return '○';
};

export default function LessonFocus() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, updateProgress } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [status, setStatus] = useState<'new' | 'in-progress' | 'completed'>('new');

  const module = useMemo(() => curriculum.find(m => m.id === moduleId), [moduleId]);
  const lesson = useMemo(() => module?.lessons.find(l => l.id === lessonId), [module, lessonId]);

  useEffect(() => {
    if (!moduleId || !lessonId) return;
    const initial = getStoredStatus(moduleId, lessonId);
    setStatus(initial === 'not-started' ? 'new' : initial);
  }, [moduleId, lessonId]);

  if (!module || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Lesson not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">Go back</button>
        </div>
      </div>
    );
  }

  const startOrContinue = () => {
    if (!moduleId || !lessonId) return;
    const next = status === 'new' ? 'in-progress' : status;
    setStatus(next);
    setStoredStatus(moduleId, lessonId, next);
  };

  const markComplete = () => {
    if (!moduleId || !lessonId) return;
    setStatus('completed');
    setStoredStatus(moduleId, lessonId, 'completed');
    if (user) updateProgress(moduleId, lessonId);
  };

  const actionLabel = status === 'new' ? 'Start Lesson' : status === 'in-progress' ? 'Continue' : 'Review';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button aria-label="Close" onClick={() => navigate(-1)} className="inline-flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
            <X className="w-5 h-5 mr-2" />
            Exit
          </button>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">{statusToIcon(status)} <span className="ml-1">{status === 'new' ? 'Not started' : status === 'in-progress' ? 'In progress' : 'Completed'}</span></div>
            <button onClick={toggleTheme} className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-2">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${module.color} text-white flex items-center justify-center text-xl`}>{module.icon}</div>
            <div className="text-left">
              <p className="text-xs text-gray-500 dark:text-gray-400">Lesson {module.lessons.findIndex(l => l.id === lesson.id) + 1}</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lesson {module.lessons.findIndex(l => l.id === lesson.id) + 1}: {lesson.title}</h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{lesson.description}</p>
          <div className="mt-2 inline-flex items-center text-sm text-gray-500 dark:text-gray-400"><Clock className="w-4 h-4 mr-1" /> {lesson.duration}</div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What you'll learn</h3>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">{lesson.content.theory}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Practice</h3>
            <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">Try the example or tackle the challenge.</div>
            <CodeEditor initialCode={lesson.content.challenge?.starterCode || lesson.content.examples?.[0]} language={moduleId === 'css' ? 'css' : moduleId === 'javascript' ? 'javascript' : 'html'} />
            <div className="flex items-center justify-between mt-4">
              <button onClick={startOrContinue} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700">
                <Play className="w-4 h-4 mr-2" />
                {actionLabel}
              </button>
              <button onClick={markComplete} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


