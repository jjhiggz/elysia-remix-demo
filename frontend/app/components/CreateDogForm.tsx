import { useState } from "react";
import type { FETypes } from "~/types";
import { TextInput } from "./Input";

export const CreateDogForm = ({
  onSubmitDog,
}: {
  onSubmitDog: (dog: Omit<FETypes["Dog"], "id" | "userId">) => Promise<unknown>;
}) => {
  const [dogName, setDogName] = useState("");
  const [dogDescription, setDogDescription] = useState("");

  const reset = () => {
    setDogName("");
    setDogDescription("");
  };

  return (
    <section className="flex flex-col text-center pt-10 ">
      <h1 className="text-2xl">CREATE DOG FORM</h1>
      <form
        className="flex flex-col gap-5 pt-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitDog({
            description: dogDescription,
            name: dogName,
          }).then(() => reset());
        }}
      >
        <TextInput
          inputProps={{
            onChange: (e) => {
              setDogName(e.target.value);
            },
            value: dogName,
          }}
          labelProps={{ htmlFor: "name" }}
          label="Dog Name"
        />
        <TextInput
          inputProps={{
            onChange: (e) => {
              setDogDescription(e.target.value);
            },
            value: dogDescription,
          }}
          labelProps={{ htmlFor: "description" }}
          label="Dog Description"
        />
        <input type="submit" value="submit" className="btn btn-success" />
      </form>
    </section>
  );
};
