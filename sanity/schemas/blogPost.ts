import { defineType, defineField } from "sanity";

export const blogPost = defineType({
    name: "blogPost",
    title: "Bài viết Blog",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Tiêu đề",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "excerpt",
            title: "Mô tả ngắn",
            type: "text",
            rows: 3,
            description: "Hiển thị trên card preview",
        }),
        defineField({
            name: "thumbnail",
            title: "Ảnh thumbnail",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "content",
            title: "Nội dung bài viết",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                        { title: "Quote", value: "blockquote" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                            { title: "Underline", value: "underline" },
                            { title: "Code", value: "code" },
                        ],
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "Link",
                                fields: [
                                    {
                                        name: "href",
                                        type: "url",
                                        title: "URL",
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [
                        {
                            name: "caption",
                            type: "string",
                            title: "Caption",
                        },
                        {
                            name: "alt",
                            type: "string",
                            title: "Alt text",
                        },
                    ],
                },
                {
                    type: "code",
                    title: "Code Block",
                    options: {
                        language: "javascript",
                        languageAlternatives: [
                            { title: "JavaScript", value: "javascript" },
                            { title: "TypeScript", value: "typescript" },
                            { title: "HTML", value: "html" },
                            { title: "CSS", value: "css" },
                            { title: "Python", value: "python" },
                            { title: "Bash", value: "bash" },
                        ],
                    },
                },
            ],
        }),
        defineField({
            name: "category",
            title: "Danh mục",
            type: "string",
            options: {
                list: [
                    { title: "Technology", value: "tech" },
                    { title: "Business", value: "business" },
                    { title: "Lifestyle", value: "lifestyle" },
                    { title: "Tutorial", value: "tutorial" },
                ],
            },
            initialValue: "tech",
        }),
        defineField({
            name: "author",
            title: "Tác giả",
            type: "string",
        }),
        defineField({
            name: "publishedAt",
            title: "Ngày đăng",
            type: "datetime",
        }),
        defineField({
            name: "readTime",
            title: "Thời gian đọc (phút)",
            type: "number",
            validation: (Rule) => Rule.min(1),
        }),
        defineField({
            name: "featured",
            title: "Nổi bật",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "order",
            title: "Thứ tự hiển thị",
            type: "number",
            initialValue: 0,
        }),
    ],
    orderings: [
        {
            title: "Ngày đăng mới nhất",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
        {
            title: "Thứ tự",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "excerpt",
            media: "thumbnail",
        },
    },
});
