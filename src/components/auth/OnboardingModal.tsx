import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ProfessionId } from '../../types';
import { PROFESSIONS_LIST } from '../../utils/professions';

interface OnboardingModalProps {
  isOpen: boolean;
  currentProfession?: ProfessionId;
  onComplete: (selected: ProfessionId) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  currentProfession = 'dasturchi',
  onComplete
}) => {
  const [selected, setSelected] = useState<ProfessionId>(currentProfession);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
            1-Qadam: Moslashtirish
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
            Kasbingizni tanlang
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-lg mx-auto">
            Tanlangan kasbingizga qarab SmartKasb boshqaruv paneli, kerakli modullar va andozalar avtomatik sozlanadi. (Buni keyin Sozlamalardan o‘zgartirishingiz mumkin)
          </p>
        </div>

        {/* Profession Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROFESSIONS_LIST.map((prof) => {
            const isSelected = selected === prof.id;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => setSelected(prof.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{prof.emoji}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-2" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {prof.label.split('(')[0]}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {prof.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400">
                  {prof.featuresList.slice(0, 2).join(' · ')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            Tanlangan: <strong className="text-neutral-900 dark:text-white">{PROFESSIONS_LIST.find((p) => p.id === selected)?.label}</strong>
          </div>
          <button
            onClick={() => onComplete(selected)}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>Tizimga o‘tish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
