import { useState } from "react";
import { TextInput } from "./Input";

export const SignInForm = ({
  onSubmit,
}: {
  onSubmit: (user: { username: string; password: string }) => Promise<unknown>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const reset = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <section className="flex flex-col text-center pt-10 ">
      <h1 className="text-2xl">CREATE DOG FORM</h1>
      <form
        className="flex flex-col gap-5 pt-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            password,
            username,
          }).then(() => reset());
        }}
      >
        <TextInput
          inputProps={{
            onChange: (e) => {
              setUsername(e.target.value);
            },
            value: username,
          }}
          labelProps={{ htmlFor: "name" }}
          label="Dog Name"
        />
        <TextInput
          inputProps={{
            onChange: (e) => {
              setPassword(e.target.value);
            },
            type: "password",
            value: password,
          }}
          labelProps={{ htmlFor: "description" }}
          label="Dog Description"
        />
        <input type="submit" value="submit" className="btn btn-success" />
      </form>
    </section>
  );
};
