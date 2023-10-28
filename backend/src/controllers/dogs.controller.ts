import Elysia, { t } from "elysia";
import { prisma } from "../prisma";

export const dogsController = new Elysia()
  .get("/dogs", () => prisma.dog.findMany({}))
  .post(
    "/dogs",
    ({ body }) => {
      return prisma.dog.create({ data: body });
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
      }),
    }
  )
  .delete(
    "/dogs/:id",
    ({ params }) => {
      return prisma.dog.delete({
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
