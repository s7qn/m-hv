import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  CheckCircle, 
  Laptop, 
  Layers
} from 'lucide-react';
import { ScheduleItem, Stage, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  selectedStage: Stage | 'all';
  language: Language;
}

const DAYS = [
  { index: 0, nameAr: 'الأحد', nameEn: 'Sunday' },
  { index: 1, nameAr: 'الاثنين', nameEn: 'Monday' },
  { index: 2, nameAr: 'الثلاثاء', nameEn: 'Tuesday' },
  { index: 3, nameAr: 'الأربعاء', nameEn: 'Wednesday' },
  { index: 4, nameAr: 'الخميس', nameEn: 'Thursday' },
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  selectedStage,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B' | 'الكل'>('A');

  const filteredSchedule = schedule.filter(item => {
    if (selectedStage !== 'all' && item.stage !== selectedStage) return false;
    if (item.dayIndex !== selectedDay) return false;
    if (selectedGroup !== 'الكل' && item.group !== 'الكل' && item.group !== selectedGroup) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-blue-950">
              {t.tabSchedule}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.scheduleDesc}
          </p>
        </div>

        {/* Group Selector */}
        <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 px-2">{t.group}:</span>
          <button
            onClick={() => setSelectedGroup('A')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedGroup === 'A' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'ar' ? 'الشعبة A' : 'Group A'}
          </button>
          <button
            onClick={() => setSelectedGroup('B')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedGroup === 'B' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'ar' ? 'الشعبة B' : 'Group B'}
          </button>
          <button
            onClick={() => setSelectedGroup('الكل')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedGroup === 'الكل' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => (
          <button
            key={day.index}
            id={`day-tab-${day.index}`}
            onClick={() => setSelectedDay(day.index)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              selectedDay === day.index
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white hover:bg-blue-50/70 text-slate-700 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{language === 'ar' ? day.nameAr : day.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Schedule Items Timeline */}
      {filteredSchedule.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            {language === 'ar' ? 'لا توجد محاضرات مجدولة لهذا اليوم' : 'No lectures scheduled for this day'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'ar'
              ? 'يمكنك مراجعة أيام الأسبوع الأخرى أو تبديل الشعبة الدراسية.'
              : 'Switch between days or check other study groups.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredSchedule.map((item, index) => {
            const isPractical = item.type === 'practical';
            const isTutorial = item.type === 'tutorial';

            return (
              <div
                key={item.id}
                id={`sch-item-${item.id}`}
                className="bg-white rounded-2xl border border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Time & Type */}
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex flex-col items-center justify-center font-black text-xs shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold">#0{index + 1}</span>
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs sm:text-sm font-black text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        {item.startTime} - {item.endTime}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isPractical
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isTutorial
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {isPractical ? t.practical : isTutorial ? t.tutorial : t.theoretical}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {language === 'ar' ? `المرحلة ${item.stage} (شعبة ${item.group})` : `Stage ${item.stage} (Group ${item.group})`}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-blue-950 mt-1.5">
                      {language === 'ar' ? item.subjectNameAr : item.subjectNameEn}
                    </h3>
                  </div>
                </div>

                {/* Room & Instructor Details */}
                <div className="flex flex-col sm:flex-row md:items-end gap-3 text-xs text-slate-600 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-800">
                      {language === 'ar' ? item.roomAr : item.roomEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-blue-50/60 px-3 py-1.5 rounded-xl border border-blue-100 text-blue-900 font-semibold">
                    <User className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {language === 'ar' ? item.instructorAr : item.instructorEn}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
