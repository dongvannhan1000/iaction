import { defineType, defineField } from "sanity";

export const product = defineType({
    name: "product",
    title: "Product",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Tên sản phẩm",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Mô tả",
            type: "text",
            rows: 3,
        }),
        defineField({
            name: "icon",
            title: "Icon",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "iconType",
            title: "Loại Icon",
            type: "string",
            description: "Chọn icon có sẵn hoặc upload ảnh icon ở trên",
            options: {
                list: [
                    { title: "Cube", value: "cube" },
                    { title: "Code", value: "code" },
                    { title: "Chart", value: "chart" },
                    { title: "Document", value: "document" },
                    { title: "Video", value: "video" },
                    { title: "Server", value: "server" },
                ],
            },
        }),
        defineField({
            name: "platforms",
            title: "Nền tảng",
            type: "array",
            of: [{ type: "string" }],
            options: {
                list: [
                    { title: "Web", value: "Web" },
                    { title: "iOS", value: "iOS" },
                    { title: "Android", value: "Android" },
                    { title: "Windows", value: "Windows" },
                    { title: "macOS", value: "macOS" },
                    { title: "Desktop", value: "Desktop" },
                ],
            },
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
            name: "demoUrl",
            title: "Link Demo",
            type: "url",
        }),
        defineField({
            name: "productUrl",
            title: "Link sản phẩm",
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
            title: "name",
            subtitle: "description",
            media: "icon",
        },
    },
});
