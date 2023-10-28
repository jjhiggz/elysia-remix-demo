import { useRevalidator } from "@remix-run/react";
import { toast } from "react-toastify";
import { treaty } from "~/treaty";
import type { FETypes } from "~/types";

export const ShowPosts = ({ posts }: { posts: FETypes["Post"][] }) => {
  const revalidator = useRevalidator();
  const hasPosts = posts.length > 0;
  return (
    <div className="container border border-primary font-monospace text-neutral max-h-52 overflow-scroll">
      {!hasPosts && (
        <div className="container min-h-16 flex flex-col justify-center p-2 border-error border-4 bg-error-content text-secondary">
          <h2 className="text-2xl">
            Create Some Posts If You Want To See Some Posts
          </h2>
        </div>
      )}
      {hasPosts &&
        posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-row justify-between m-2 bg-accent p-2 items-center"
          >
            <div className="">
              <div>
                <b className="font-monospace">TITLE:</b>
                {post.title}
              </div>
              <div>
                <b className="font-monospace">DESCRIPTION:</b>
                {post.description}
              </div>
              <div>
                <b className="font-monospace">LINK:</b>
                {post.link}
              </div>
            </div>
            <button
              className="btn btn-error btn-sm"
              onClick={() => {
                treaty.posts[post.id]
                  .delete()
                  .then(revalidator.revalidate)
                  .catch(() => {
                    toast.error("Could not delete post");
                  });
              }}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};
