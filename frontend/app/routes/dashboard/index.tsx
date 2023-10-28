import { useLoaderData, useRevalidator } from "@remix-run/react";
import { match, P } from "ts-pattern";
import { ShowError } from "~/components/ShowError";
import { treaty } from "~/treaty";
import { ShowPosts } from "~/components/ShowPosts";
import { CreatePostForm } from "~/components/CreatePostForm";

export const loader = async () => {
  return treaty.posts.get();
};

const HomePage = () => {
  const data = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  return (
    <div className="flex flex-col items-center pt-5 font-monospace gap-10 h-full flex-1">
      <h1 className="text-3xl">Posts</h1>
      {match(data)
        .with({ error: P.not(P.nullish).select() }, (err) => {
          return <ShowError error={err} />;
        })
        .with({ data: P.not(P.nullish).select() }, (posts) => {
          return <ShowPosts posts={posts} />;
        })
        .run()}

      <CreatePostForm
        onSubmitPost={(newPost) =>
          treaty.posts
            .post(newPost)
            .then(() => {
              revalidator.revalidate();
            })
            .catch(console.error)
        }
      />
    </div>
  );
};

export default HomePage;
