"use client";

import { useState } from "react";
import type { SanityCourse, SanitySiteSettings } from "../../sanity/lib/types";
import { urlFor } from "../../sanity/lib/client";
import CourseModal from "./CourseModal";

// Icon components for courses
const Icons = {
    academy: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    video: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    book: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    ),
    certificate: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
    ),
    code: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
    ),
    chart: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
};

const levelLabels: Record<string, { text: string; color: string }> = {
    beginner: { text: "Cơ bản", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    intermediate: { text: "Trung cấp", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    advanced: { text: "Nâng cao", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

interface CourseCardProps {
    course: SanityCourse;
    onEnrollClick: (course: SanityCourse) => void;
}

function CourseCard({ course, onEnrollClick }: CourseCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const levelInfo = levelLabels[course.level || "beginner"];

    return (
        <div
            className={`group relative rounded-2xl p-6 glass card-hover cursor-pointer flex flex-col h-full ${course.featured ? "md:col-span-2" : ""
                }`}
        >
            {course.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="text-xs text-red-400 font-medium">Featured</span>
                </div>
            )}

            {/* Thumbnail or Icon */}
            {course.thumbnail ? (
                <div className="w-full h-40 rounded-xl mb-6 overflow-hidden">
                    <img
                        src={urlFor(course.thumbnail).width(400).height(200).url()}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mb-6 group-hover:glow-red-sm transition-all">
                    {Icons[course.iconType as keyof typeof Icons] || Icons.academy}
                </div>
            )}

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {course.title}
            </h3>

            {/* Description with fixed height */}
            <p className="text-gray-400 mb-4 line-clamp-2 min-h-[48px]">{course.description}</p>

            {/* Spacer to push content below to bottom */}
            <div className="flex-grow"></div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelInfo.color}`}>
                    {levelInfo.text}
                </span>
                {course.duration && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                        {course.duration}
                    </span>
                )}
                {course.lessonsCount && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                        {course.lessonsCount} bài học
                    </span>
                )}
            </div>

            {/* Price */}
            <div className="mb-4">
                {course.isPaid && course.price > 0 ? (
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-400">
                            {formatPrice(course.price)}
                        </span>
                        {course.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(course.originalPrice)}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-2xl font-bold text-green-400">Miễn phí</span>
                )}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onEnrollClick(course)}
                    className="flex-1 btn-primary py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                    Đăng ký ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

interface CoursesProps {
    courses: SanityCourse[];
    settings: SanitySiteSettings | null;
}

const INITIAL_COURSES_COUNT = 6;

export default function Courses({ courses, settings }: CoursesProps) {
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<SanityCourse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const subtitle = settings?.coursesSubtitle || "Các khóa học chất lượng giúp bạn nâng cao kỹ năng";

    const handleEnrollClick = (course: SanityCourse) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
    };

    // Filter courses by search term
    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedCourses = showAll
        ? filteredCourses
        : filteredCourses.slice(0, INITIAL_COURSES_COUNT);

    const hasMoreCourses = filteredCourses.length > INITIAL_COURSES_COUNT;
    const remainingCount = filteredCourses.length - INITIAL_COURSES_COUNT;

    // If no courses from Sanity, show empty state
    if (!courses || courses.length === 0) {
        return (
            <section id="courses" className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Khóa học </span>
                            <span className="text-gradient">nổi bật</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-gray-500">Chưa có khóa học nào. Thêm khóa học trong <a href="/studio" className="text-red-400 hover:underline">Sanity Studio</a>.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="courses" className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Khóa học </span>
                            <span className="text-gradient">nổi bật</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {subtitle}
                        </p>

                        {/* Search Input */}
                        <div className="max-w-md mx-auto relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowAll(false);
                                }}
                                className="w-full px-5 py-3 pl-12 rounded-xl glass border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none transition-colors"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* No results message */}
                    {filteredCourses.length === 0 && searchTerm && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Không tìm thấy khóa học nào phù hợp với "{searchTerm}"</p>
                        </div>
                    )}

                    {filteredCourses.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayedCourses.map((course) => (
                                    <CourseCard
                                        key={course._id}
                                        course={course}
                                        onEnrollClick={handleEnrollClick}
                                    />
                                ))}
                            </div>

                            {hasMoreCourses && (
                                <div className="text-center mt-12">
                                    <button
                                        onClick={() => setShowAll(!showAll)}
                                        className="btn-outline px-8 py-4 rounded-full font-semibold inline-flex items-center gap-3 cursor-pointer"
                                    >
                                        {showAll ? (
                                            <>
                                                Thu gọn
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                Xem thêm {remainingCount} khóa học
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <CourseModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                course={selectedCourse}
            />
        </>
    );
}
