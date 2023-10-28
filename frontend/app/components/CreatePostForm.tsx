import { useState } from "react";
import type { FETypes } from "~/types";
import { TextInput } from "./Input";

export const CreatePostForm = ({
  onSubmitPost,
}: {
  onSubmitPost: (
    post: Omit<FETypes["Post"], "id" | "userId">
  ) => Promise<unknown>;
}) => {
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postLink, setPostLink] = useState("");

  const reset = () => {
    setPostTitle("");
    setPostDescription("");
    setPostLink("");
  };

  return (
    <section className="flex flex-col text-center pt-10 ">
      <h1 className="text-2xl">CREATE POST FORM</h1>
      <form
        className="flex flex-col gap-5 pt-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitPost({
            // post
            description: postDescription,
            title: postTitle,
            link: postLink,
          }).then(() => reset());
        }}
      >
        <TextInput
          inputProps={{
            onChange: (e) => {
              setPostTitle(e.target.value);
            },
            value: postTitle,
          }}
          labelProps={{ htmlFor: "name" }}
          label="Post Title"
        />
        <TextInput
          inputProps={{
            onChange: (e) => {
              //@ts-ignore
              setPostDescription(e.target.value);
            },
            value: postDescription,
          }}
          labelProps={{ htmlFor: "description" }}
          label="Post Description"
        />
        <TextInput
          inputProps={{
            onChange: (e) => {
              //@ts-ignore
              setPostLink(e.target.value);
            },
            value: postLink,
          }}
          labelProps={{ htmlFor: "link" }}
          label="Post Link"
        />
        <input type="submit" value="submit" className="btn btn-success" />
      </form>
    </section>
  );
};
