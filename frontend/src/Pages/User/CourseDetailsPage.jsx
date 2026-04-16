import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllPurchaseCourse, useGetSingleCourseHook } from "@/hooks/course.hook";
import { useGetCourseProgress } from "@/hooks/progress.hook";
import { usePayment } from "@/hooks/payment.hook";
import { Clock, BarChart2, Tag, User, BookOpen, CheckCircle2, BadgeCheck, Lock, PlayCircle } from "lucide-react";

const Chip = ({ children }) => <span className="chip">{children}</span>;

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#51607b]">
    {children}
  </h3>
);

const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
};

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: course, isLoading } = useGetSingleCourseHook(courseId);
  const { data: purchaseData } = useGetAllPurchaseCourse();
  const { mutate, isPending } = usePayment();

  const isPurchased = useMemo(() => {
    if (course?.isPurchased) return true;
    const purchased = purchaseData?.purchasedCourse || [];
    return purchased?.some?.((c) => String(c?._id) === String(courseId));
  }, [course?.isPurchased, purchaseData, courseId]);

  const { data: progressData } = useGetCourseProgress(courseId, isPurchased);
  const hasStartedCourse = Boolean((progressData?.completedCount || 0) > 0);
  const primaryActionLabel = isPurchased
    ? hasStartedCourse
      ? "Continue Learning"
      : "Start Learning"
    : isPending
      ? "Processing..."
      : "Enroll Now";

  const overviewText = course?.overview || course?.description || "";
  const topics = course?.tags?.length ? course.tags : toArray(course?.description).slice(0, 4);
  const requirements = course?.requirements?.length ? course.requirements : toArray(course?.requirements);
  const learningOutcomes = course?.learningOutcomes?.length
    ? course.learningOutcomes
    : toArray(overviewText).slice(0, 6);

  const modules = Array.isArray(course?.modules) ? [...course.modules] : [];
  modules.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const modulePreview = modules.slice(0, 4);
  const firstPreviewModule = modules.find((mod) => mod?.isPreviewFree);
  const showRoadmapLabel = Boolean(location?.state?.fromRoadmap || location?.state?.roadmapPhase);

  const purchaseHandler = () => {
    if (!course) return;
    const product = {
      products: {
        _id: course._id,
        name: course.title,
        price: course.amount,
        image: course.thumbnail
      }
    };
    mutate(product);
  };

  const handlePrimaryAction = () => {
    if (isPurchased) {
      navigate(`/courses/${courseId}/learn`);
      return;
    }
    purchaseHandler();
  };

  const handleModuleAction = (mod) => {
    if (!mod?._id) return;
    if (isPurchased || mod.isPreviewFree) {
      navigate(`/courses/${courseId}/learn?module=${mod._id}`);
      return;
    }
    purchaseHandler();
  };

  if (isLoading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-[#51607b]">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div className="page-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-8">
            <div className="card">
              {showRoadmapLabel ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0ea5a4]">
                  Recommended for your roadmap phase
                </p>
              ) : null}
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0f172a]">
                {course.title}
              </h1>
              <p className="mt-3 text-sm text-[#51607b] leading-relaxed">
                {course.description || "Upgrade your skills with this professional course."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Chip>
                  <BarChart2 className="h-3.5 w-3.5 mr-1" />
                  {course.level || "All levels"}
                </Chip>
                <Chip>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {course.duration || "Flexible"}
                </Chip>
                {course.category ? <Chip>{course.category}</Chip> : <Chip>Self-paced</Chip>}
                {topics?.[0] ? (
                  <Chip>
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {topics[0]}
                  </Chip>
                ) : null}
                {course.subcategory ? <Chip>{course.subcategory}</Chip> : null}
              </div>
            </div>

            <div className="card">
              <SectionTitle>What you will learn</SectionTitle>
              <ul className="mt-4 space-y-2 text-sm text-[#0f172a]">
                {(learningOutcomes?.length ? learningOutcomes : []).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0ea5a4] mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
                {learningOutcomes?.length === 0 ? (
                  <li className="text-[#51607b]">Clear learning outcomes will be shared inside the course.</li>
                ) : null}
              </ul>
            </div>

            <div className="card">
              <SectionTitle>Modules preview</SectionTitle>
              <ol className="mt-4 space-y-3 text-sm text-[#0f172a]">
                {modulePreview.length ? (
                  modulePreview.map((mod, index) => (
                    <li key={mod?._id || mod?.title || index} className="rounded-2xl border border-gray-200 bg-white p-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0ea5a4] text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-[#0f172a]">
                            {mod?.title || mod?.name || `Module ${index + 1}`}
                          </p>
                          {mod?.description ? (
                            <p className="mt-1 text-xs text-[#51607b]">{mod.description}</p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#51607b]">
                            {mod?.duration ? <span>{mod.duration}</span> : null}
                            {mod?.isPreviewFree ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#f5fbfa] px-2 py-0.5 text-[#0ea5a4]">
                                <BadgeCheck className="h-3 w-3" /> Preview free
                              </span>
                            ) : null}
                            {!isPurchased && !mod?.isPreviewFree ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#fde68a] px-2 py-0.5 text-[#f59e0b]">
                                <Lock className="h-3 w-3" /> Locked
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={() => handleModuleAction(mod)}
                              className="btn-secondary inline-flex items-center gap-2 text-xs px-3 py-1.5"
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              {isPurchased ? "Open Module" : mod?.isPreviewFree ? "Watch Preview" : "Unlock Course"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-[#51607b]">Modules will appear once available.</li>
                )}
              </ol>
              {modules.length > 4 ? (
                <p className="mt-3 text-xs font-semibold text-[#0ea5a4]">View full curriculum</p>
              ) : null}
            </div>

            <div className="card">
              <SectionTitle>Requirements</SectionTitle>
              <div className="mt-4 text-sm text-[#0f172a]">
                {requirements.length ? (
                  <ul className="space-y-2">
                    {requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-gray-400" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#51607b]">No prerequisites required. Start from scratch.</p>
                )}
              </div>
            </div>

            <div className="card">
              <SectionTitle>Description</SectionTitle>
              <p className="mt-4 text-sm text-[#0f172a] leading-relaxed">
                {overviewText || "Course overview will be available soon."}
              </p>
            </div>

            <div className="card">
              <SectionTitle>Instructor</SectionTitle>
              <div className="mt-4 flex items-center gap-3 text-sm text-[#0f172a]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0ea5a4] text-white">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-[#0f172a]">{course.instructor || "EduSmart team"}</p>
                  <p className="text-xs text-[#51607b]">Industry professional & course author</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:pl-2">
            <div className="lg:sticky lg:top-[96px]">
              <div className="card">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-48 rounded-2xl bg-gray-100 flex items-center justify-center text-sm text-[#51607b]">
                    No thumbnail
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-[#0f172a]">INR {course.amount}</p>
                    {!isPurchased ? (
                      <p className="text-xs text-[#51607b]">One-time enrollment</p>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#f5fbfa] px-2.5 py-1 text-xs font-semibold text-[#0ea5a4]">
                        Enrolled
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2 text-xs text-[#51607b]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {modules.length ? `${modules.length} modules` : "Structured modules"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {course.duration || "Flexible duration"}
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      {course.level || "All levels"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-[#f5f7fb] px-3 py-2 text-xs text-[#51607b]">
                    {course.subcategory || course.category || "Learning track"} - {course.isPublished ? "Published" : "Draft"}
                  </div>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handlePrimaryAction}
                    className="w-full btn-primary"
                  >
                    {primaryActionLabel}
                  </button>
                  {!isPurchased && firstPreviewModule ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/courses/${courseId}/learn?module=${firstPreviewModule._id}`)}
                      className="w-full btn-secondary"
                    >
                      Watch Free Preview
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;







