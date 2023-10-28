import Elysia, { t } from "elysia";
import { prisma } from "../prisma";

export const postsController = new Elysia()
  .get("/posts", () => prisma.post.findMany({}))
  .post(
    "/posts",
    ({ body }) => {
      return prisma.post.create({ data: body });
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        link: t.String({
          examples: "http://mywebsite.com",
        }),
      }),
    }
  )
  .delete(
    "/posts/:id",
    ({ params }) => {
      return prisma.post.delete({
        where: {
          id: params.id,
        },
      });
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
