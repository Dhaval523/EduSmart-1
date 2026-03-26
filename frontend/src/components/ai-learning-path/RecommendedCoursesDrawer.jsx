import React from "react";
import { X, Star, User } from "lucide-react";

const Badge = ({ children, variant = "default" }) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border";
  const styles =
    variant === "best"
      ? "bg-[#FFE3DA] text-[#1F2937] border-gray-200"
      : "bg-gray-100 text-[#1F2937] border-gray-200";
  return <span className={`${base} ${styles}`}>{children}</span>;
};

const CourseRecommendationCard = ({ course, isBestMatch, onStart, onView, onNavigate }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate?.();
        }
      }}
      className="w-full text-left flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#A29BFE]/40"
    >
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-16 w-24 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="h-16 w-24 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-[#6B7280] flex-shrink-0">
          No image
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[#1F2937] line-clamp-2">{course.title}</p>
            <p className="mt-1 text-xs text-[#6B7280] line-clamp-2">{course.description}</p>
            {course.instructor ? (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#6B7280]">
                <User className="h-3 w-3" />
                {course.instructor}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1">
            {isBestMatch ? (
              <Badge variant="best">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Best match
              </Badge>
            ) : null}
            <p className="text-[11px] font-semibold text-[#6B7280]">
              Match score: {course.matchScore}
            </p>
          </div>
        </div>
        {course.matchReason ? (
          <p className="mt-2 text-xs text-[#6B7280]">{course.matchReason}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1 text-[11px] text-[#6B7280]">
            {(course.tags?.length ? course.tags : course.topics)?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-gray-100 px-2 py-0.5 border border-gray-200"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView?.();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1F2937] hover:bg-[#F7F7FB] transition-colors"
            >
              View details
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStart?.();
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#6C5DD3] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#F7F5FF]0 transition-colors"
            >
              Start course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecommendedCoursesDrawer = ({
  isOpen,
  onClose,
  phase,
  recommendations,
  bestMatchCourseId,
  isLoading,
  error,
  onStartCourse,
  onNavigateCourse
}) => {
  if (!isOpen) return null;

  const hasRecs = Array.isArray(recommendations) && recommendations.length > 0;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-[#6C5DD3]/40" onClick={onClose} />
      <div className="relative z-50 h-full w-full max-w-md bg-[#F7F7FB] shadow-md border-l border-gray-200 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6C5DD3]">
              Recommended courses
            </p>
            <p className="text-sm font-bold text-[#1F2937]">
              {phase ? `Phase ${phase.id}: ${phase.title}` : "Selected phase"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 text-[#6B7280]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-200 bg-[#F7F7FB] text-xs text-[#6B7280]">
          These courses are selected based on this roadmap phase, your skill level and overall
          learning goal.
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-24 rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded-full bg-gray-200" />
                      <div className="h-3 w-full rounded-full bg-gray-200" />
                      <div className="h-3 w-2/3 rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : !hasRecs ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-sm text-[#6B7280]">
              We could not find strong course matches for this phase. Try exploring all courses from
              the home page search instead.
            </div>
          ) : (
            <>
              {recommendations.map((rec) => (
                <CourseRecommendationCard
                  key={rec.id}
                  course={rec}
                  isBestMatch={bestMatchCourseId === rec.id || rec.isBestMatch}
                  onStart={() => onStartCourse?.(rec)}
                  onView={() => onNavigateCourse?.(rec)}
                  onNavigate={() => onNavigateCourse?.(rec)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};








