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
            name: "categories",
            title: "Danh mục",
            type: "array",
            of: [{ type: "reference", to: [{ type: "productCategory" }] }],
            description: "Chọn một hoặc nhiều danh mục cho sản phẩm",
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
        defineField({
            name: "usageGuide",
            title: "Hướng dẫn sử dụng",
            type: "text",
            rows: 10,
            description: "Hướng dẫn sử dụng sản phẩm (sẽ được gửi qua email sau khi thanh toán)",
        }),
        defineField({
            name: "isExternal",
            title: "Sản phẩm không mua hàng tại đây",
            type: "boolean",
            description: "Nếu tích, nút hành động (Mua ngay/Nhận ngay) sẽ điều hướng thẳng sang Landing Page khác",
            initialValue: false,
        }),
        defineField({
            name: "externalUrl",
            title: "Link Landing Page ngoại",
            type: "url",
            hidden: ({ parent }) => !parent?.isExternal,
            validation: (Rule) => Rule.custom((url, context) => {
                const parent = context.parent as { isExternal?: boolean };
                if (parent?.isExternal && !url) {
                    return "Bắt buộc phải nhập Link Landing Page khi chọn Sản phẩm không mua hàng tại đây";
                }
                return true;
            }),
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
