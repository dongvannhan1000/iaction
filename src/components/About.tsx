import type { SanitySiteSettings } from "../../sanity/lib/types";
import { urlFor } from "../../sanity/lib/client";

interface AboutProps {
    settings: SanitySiteSettings | null;
}

// Default values when no Sanity data
const defaultSkills = [
    { category: "Frontend", items: "React, Next.js, TypeScript" },
    { category: "Backend", items: "Node.js, NestJS, Express" },
    { category: "Database", items: "PostgreSQL, MongoDB, Redis" },
    { category: "DevOps", items: "Docker, AWS, CI/CD" },
];

const defaultStats = [
    { value: "4+", label: "Dự án" },
    { value: "2+", label: "Năm KN" },
    { value: "100%", label: "Đam mê" },
];

export default function About({ settings }: AboutProps) {
    // Convert old skills format (name, level) to new format (category, items)
    const rawSkills = settings?.skills;
    let skills: Array<{ category: string; items: string }>;

    if (rawSkills?.length) {
        // Check if skills are in new format (has 'category' and 'items')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstSkill = rawSkills[0] as any;
        if (firstSkill.category && firstSkill.items) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            skills = rawSkills as any;
        } else {
            // Old format - convert or use defaults
            skills = defaultSkills;
        }
    } else {
        skills = defaultSkills;
    }

    const stats = settings?.stats?.length ? settings.stats : defaultStats;
    const name = settings?.aboutName || "IAction Developer";
    const role = settings?.aboutRole || "Full-stack Developer & Product Creator";
    const hasSkills = skills.length > 0;

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left - Image/Avatar */}
                    <div className="relative">
                        <div className="relative w-full max-w-md mx-auto">
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border border-red-500/20" />
                            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-red-500/10 to-transparent" />

                            {/* Main Card */}
                            <div className="relative glass rounded-3xl p-8">
                                {/* Avatar */}
                                {settings?.aboutAvatar ? (
                                    <img
                                        src={urlFor(settings.aboutAvatar).width(128).height(128).url()}
                                        alt={name}
                                        className="w-32 h-32 mx-auto mb-6 rounded-full object-cover glow-red"
                                    />
                                ) : (
                                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center glow-red">
                                        <span className="text-5xl font-bold text-white">IA</span>
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-white text-center mb-2">
                                    {name}
                                </h3>
                                <p className="text-gray-400 text-center mb-6">
                                    {role}
                                </p>

                                {/* Stats - Flexible layout that centers based on item count */}
                                <div className="flex flex-wrap justify-center gap-6 text-center">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="min-w-[80px]">
                                            <div className="text-2xl font-bold text-red-400">{stat.value}</div>
                                            <div className="text-sm text-gray-500">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className={hasSkills ? "" : "flex flex-col justify-center h-full"}>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="text-white">Về </span>
                            <span className="text-gradient">tác giả</span>
                        </h2>

                        <div className="text-gray-400 text-lg mb-8 leading-relaxed space-y-4">
                            {settings?.aboutContent ? (
                                // Render Portable Text (simplified - just paragraphs for now)
                                settings.aboutContent.map((block: unknown, index: number) => {
                                    const blockData = block as { _type?: string; children?: Array<{ text?: string }> };
                                    if (blockData._type === "block" && blockData.children) {
                                        const text = blockData.children.map((child) => child.text || "").join("");
                                        return <p key={index}>{text}</p>;
                                    }
                                    return null;
                                })
                            ) : (
                                <>
                                    <p>
                                        Xin chào! Tôi là một developer đam mê xây dựng các sản phẩm phần mềm
                                        giải quyết vấn đề thực tế. Mỗi dự án đều được tạo ra với sự chú ý
                                        đến chi tiết và trải nghiệm người dùng.
                                    </p>
                                    <p>
                                        Từ ý tưởng đến sản phẩm hoàn chỉnh, tôi tin vào việc tạo ra những
                                        ứng dụng không chỉ đẹp mà còn hữu ích và dễ sử dụng.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Skills - Category-based listing */}
                        {hasSkills && (
                            <div className="space-y-3">
                                <h4 className="text-lg font-semibold text-white mb-4">Kỹ năng</h4>
                                <div className="space-y-2">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex flex-wrap gap-2">
                                            <span className="text-red-400 font-medium min-w-[100px]">
                                                {skill.category}:
                                            </span>
                                            <span className="text-gray-300">{skill.items}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

