import { edenTreaty } from "@elysiajs/eden";
import type { ElysiaApp } from "backend";

// @ts-ignore
export const treaty = edenTreaty<ElysiaApp>("http://localhost:8080");
