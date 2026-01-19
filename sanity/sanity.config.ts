import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
    name: "iaction-studio",
    title: "IAction Studio",

    projectId,
    dataset,

    plugins: [
        structureTool(),
        visionTool({ defaultApiVersion: "2024-01-01" }),
        codeInput(),
    ],

    schema: {
        types: schemaTypes,
    },

    basePath: "/studio",
});

