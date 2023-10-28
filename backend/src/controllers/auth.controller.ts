import Elysia, { t } from "elysia";
import { luciaModule } from "../auth/lucia";
import { prisma } from "../prisma";

export const authController = new Elysia({ prefix: "/auth" })
  .use(luciaModule.elysia)
  //   If you want to set up oath
  //   .use(
  //     luciaModule.oauth.github({
  //       clientId: GH_CLIENT_ID,
  //       clientSecret: GH_CLIENT_SECRET,
  //     })
  //   )
  .guard(
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
    (app) =>
      app
        .put("/sign-up", async ({ body, user }) => {
          return user.signUp(body);
        })
        .post("/sign-in", async ({ user, body: { username, password } }) => {
          await user.signIn(username, password);

          return `Sign in as ${username}`;
        })
  )
  .guard(
    {
      beforeHandle: ({ user: { validate } }) => validate(),
    },
    (app) =>
      app

        .get("/profile", async ({ user }) => {
          return prisma.user.findFirst({
            where: {
              id: await user.id,
            },
            select: {
              username: true,
              id: true,
            },
          });
        })
        .get("/refresh", async ({ user }) => {
          await user.refresh();

          return user.data;
        })
        .get("/sign-out", async ({ user }) => {
          await user.signOut();

          return "Signed out";
        })
  );
