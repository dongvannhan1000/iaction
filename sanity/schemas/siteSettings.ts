import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
    name: "siteSettings",
    title: "Site Settings",
    type: "document",
    fields: [
        defineField({
            name: "siteName",
            title: "Tên trang web",
            type: "string",
            initialValue: "IAction",
        }),
        defineField({
            name: "heroTitle",
            title: "Tiêu đề Hero",
            type: "string",
            initialValue: "From Idea to Action",
        }),
        defineField({
            name: "heroSubtitle",
            title: "Mô tả Hero",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "heroBadge",
            title: "Badge Hero",
            type: "string",
            initialValue: "Khám phá các sản phẩm mới nhất",
        }),
        defineField({
            name: "productsSubtitle",
            title: "Subtitle phần Sản phẩm",
            type: "string",
            initialValue: "Những ứng dụng và phần mềm tôi đã xây dựng với tâm huyết",
        }),
        defineField({
            name: "coursesSubtitle",
            title: "Subtitle phần Khóa học",
            type: "string",
            initialValue: "Các khóa học chất lượng giúp bạn nâng cao kỹ năng",
        }),
        defineField({
            name: "blogSubtitle",
            title: "Subtitle phần Blog",
            type: "string",
            initialValue: "Chia sẻ kiến thức và kinh nghiệm về công nghệ",
        }),
        defineField({
            name: "aboutTitle",
            title: "Tiêu đề About",
            type: "string",
            initialValue: "Về tác giả",
        }),
        defineField({
            name: "aboutContent",
            title: "Nội dung About",
            type: "array",
            of: [{ type: "block" }],
        }),
        defineField({
            name: "aboutAvatar",
            title: "Avatar",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "aboutName",
            title: "Tên hiển thị",
            type: "string",
            initialValue: "IAction Developer",
        }),
        defineField({
            name: "aboutRole",
            title: "Vai trò",
            type: "string",
            initialValue: "Full-stack Developer & Product Creator",
        }),
        defineField({
            name: "stats",
            title: "Thống kê",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "value", title: "Giá trị", type: "string" },
                        { name: "label", title: "Nhãn", type: "string" },
                    ],
                },
            ],
        }),
        defineField({
            name: "skills",
            title: "Kỹ năng",
            description: "Liệt kê kỹ năng theo danh mục (VD: Frontend: React, Next.js)",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "category", title: "Danh mục", type: "string", description: "VD: Frontend, Backend, Database" },
                        { name: "items", title: "Các kỹ năng", type: "string", description: "VD: React, Next.js, TypeScript" },
                    ],
                    preview: {
                        select: {
                            title: "category",
                            subtitle: "items",
                        },
                    },
                },
            ],
        }),
        defineField({
            name: "email",
            title: "Email liên hệ",
            type: "string",
        }),
        defineField({
            name: "phone",
            title: "Số điện thoại",
            type: "string",
        }),
        defineField({
            name: "socialLinks",
            title: "Social Links",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "platform",
                            title: "Nền tảng",
                            type: "string",
                            options: {
                                list: [
                                    { title: "GitHub", value: "github" },
                                    { title: "LinkedIn", value: "linkedin" },
                                    { title: "Twitter", value: "twitter" },
                                    { title: "Facebook", value: "facebook" },
                                    { title: "YouTube", value: "youtube" },
                                ],
                            },
                        },
                        { name: "url", title: "URL", type: "url" },
                    ],
                },
            ],
        }),
    ],
    preview: {
        select: {
            title: "siteName",
        },
        prepare() {
            return {
                title: "Site Settings",
            };
        },
    },
});
