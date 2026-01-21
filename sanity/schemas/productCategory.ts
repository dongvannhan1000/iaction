import { defineType, defineField } from "sanity";

export const productCategory = defineType({
    name: "productCategory",
    title: "Danh mục sản phẩm",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Tên danh mục",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 50,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Mô tả",
            type: "text",
            rows: 2,
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
        },
    },
});
