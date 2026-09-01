import React from 'react';
import { getCalendarGrid, formatMonthYear } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

export default function CalendarView({
  year,
  month,
  selectedDate,
  monthlySummary = {},
  onMonthChange,
  onSelectDate,
}) {
  const grid = getCalendarGrid(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Calendar Header with Navigation */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800">
            {formatMonthYear(year, month)}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-200/60 transition-colors border border-slate-200"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const now = new Date();
              onMonthChange(now.getFullYear(), now.getMonth());
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            This Month
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-200/60 transition-colors border border-slate-200"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30 text-center py-2.5">
        {weekDays.map((day) => (
          <span key={day} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-100">
        {grid.map((cell, idx) => {
          const summary = monthlySummary[cell.dateStr];
          const hasMeals = summary && summary.count > 0;
          const isSelected = selectedDate === cell.dateStr;

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`min-h-[80px] sm:min-h-[96px] p-2 bg-white flex flex-col justify-between cursor-pointer transition-all hover:bg-emerald-50/30 ${
                !cell.isCurrentMonth ? 'text-slate-300 bg-slate-50/50' : 'text-slate-800'
              } ${isSelected ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50/40' : ''}`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center text-xs sm:text-sm font-bold w-6 h-6 rounded-full ${
                    cell.isToday
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isSelected
                      ? 'bg-emerald-100 text-emerald-800'
                      : ''
                  }`}
                >
                  {cell.dayNum}
                </span>

                {hasMeals && (
                  <span className="flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="hidden sm:inline">{summary.completedCount}/{summary.count}</span>
                  </span>
                )}
              </div>

              {/* Meals Indicator */}
              <div className="mt-1 flex-1">
                {hasMeals ? (
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 truncate max-w-full">
                        {summary.count} {summary.count === 1 ? 'meal' : 'meals'}
                      </span>
                    </div>
                  </div>
                ) : cell.isCurrentMonth ? (
                  <span className="text-[10px] text-slate-300 hidden sm:inline-block italic">Empty</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
