import { defineType, defineField } from "sanity";

export const course = defineType({
    name: "course",
    title: "Khóa học",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Tên khóa học",
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
            name: "description",
            title: "Mô tả ngắn",
            type: "text",
            rows: 3,
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
            name: "iconType",
            title: "Loại Icon",
            type: "string",
            options: {
                list: [
                    { title: "Academy", value: "academy" },
                    { title: "Video", value: "video" },
                    { title: "Book", value: "book" },
                    { title: "Certificate", value: "certificate" },
                    { title: "Code", value: "code" },
                    { title: "Chart", value: "chart" },
                ],
            },
            initialValue: "academy",
        }),
        defineField({
            name: "level",
            title: "Cấp độ",
            type: "string",
            options: {
                list: [
                    { title: "Beginner", value: "beginner" },
                    { title: "Intermediate", value: "intermediate" },
                    { title: "Advanced", value: "advanced" },
                ],
            },
            initialValue: "beginner",
        }),
        defineField({
            name: "duration",
            title: "Thời lượng",
            type: "string",
            description: "Ví dụ: 10 giờ, 2 tuần",
        }),
        defineField({
            name: "lessonsCount",
            title: "Số bài học",
            type: "number",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "price",
            title: "Giá (VND)",
            type: "number",
            description: "Để 0 nếu miễn phí",
            validation: (Rule) => Rule.min(0),
        }),
        defineField({
            name: "originalPrice",
            title: "Giá gốc (VND)",
            type: "number",
            description: "Để trống nếu không có giảm giá",
        }),
        defineField({
            name: "isPaid",
            title: "Có phải trả phí?",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "featured",
            title: "Nổi bật",
            type: "boolean",
            initialValue: false,
        }),
        defineField({
            name: "courseUrl",
            title: "Link khóa học",
            type: "url",
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
            title: "Thứ tự",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "description",
            media: "thumbnail",
        },
    },
});
