import { Elysia } from "elysia";
import { createThrowMiddleware } from "./src/middleware/throw-randomly";
import { dogsController } from "./src/controllers/dogs.controller";
import { postsController } from "./src/controllers/posts.controller";
import { authController } from "./src/controllers/auth.controller";
import swagger from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors({}))
  .post("/auth/sign-in", () => "done")
  .use(authController)
  .onBeforeHandle(async ({ path, user }) => {
    switch (path) {
      case "/swagger":
      case "/swagger/json":
        await user.validate();
    }
  })
  .use(swagger())
  .onRequest(
    // Play around with this if you want to test out error handling
    createThrowMiddleware({
      shouldThrowRandomly: true,
      timesOutOfTenToThrow: 0,
    })
  )
  .use(postsController)
  .use(dogsController)
  .listen(8080);

const myApp = new Elysia()
  .use(
    cors({
      origin: true,
    })
  )
  .post("/test", () => "success")
  .listen(3333);

export type ElysiaApp = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export const allowedHeaders = [
  "Accept",
  "Accept-Encoding",
  "Accept-Language",
  "Cache-Control",
  "Connection",
  "Content-Type",
  "Authorization",
  "Accept",
  "Content-Length",
  "Date",
  "Host",
  "Origin",
  "Pragma",
  "Referer",
  "Sec-Ch-Ua",
  "Sec-Ch-Ua-Mobile",
  "Sec-Ch-Ua-Platform",
  "Sec-Fetch-Dest",
  "Sec-Fetch-Mode",
  "Sec-Fetch-Site",
  "User-Agent",
];
