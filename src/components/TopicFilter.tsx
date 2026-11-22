import React from 'react';
import { Topic } from '../types';
import { Layers } from 'lucide-react';
import { TOEICPhase } from '../data/toeicSkillData';

interface TopicFilterProps {
  topics: Topic[];
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  currentPhase?: TOEICPhase;
}

export const TopicFilter: React.FC<TopicFilterProps> = ({
  topics,
  activeTopicId,
  onSelectTopic,
  currentPhase = 'foundation',
}) => {
  // Filter topics based on active phase
  const displayedTopics = topics.filter(topic => {
    if (currentPhase === 'foundation') {
      return topic.day <= 15;
    } else if (currentPhase === 'acceleration') {
      return topic.day >= 16 && topic.day <= 30;
    }
    return true;
  });

  return (
    <div className="py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSelectTopic('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTopicId === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tất cả chủ đề ({displayedTopics.length})</span>
        </button>

        {displayedTopics.map(topic => {
          const isActive = activeTopicId === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <span>{topic.titleVi}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
