import { useRevalidator } from "@remix-run/react";
import { treaty } from "~/treaty";
import type { FETypes } from "~/types";

export const ShowDogs = ({ dogs }: { dogs: FETypes["Dog"][] }) => {
  const revalidator = useRevalidator();
  const hasDogs = dogs.length > 0;
  return (
    <div className="container border border-primary font-monospace text-neutral max-h-52 overflow-scroll">
      {!hasDogs && (
        <div className="container min-h-16 flex flex-col justify-center p-2 border border-error border-4 bg-error-content text-secondary">
          <h2 className="text-2xl">
            Create Some Dogs If You Want To See Some Dogs
          </h2>
        </div>
      )}
      {hasDogs &&
        dogs.map((dog) => (
          <div
            key={dog.id}
            className="flex flex-row justify-between m-2 bg-accent p-2 items-center"
          >
            <div className="">
              <div>
                <b className="font-monospace">NAME:</b>
                {dog.name}
              </div>
              <div>
                <b className="font-monospace">DESCRIPTION:</b>
                {dog.description}
              </div>
            </div>
            <button
              className="btn btn-error btn-sm"
              onClick={() => {
                treaty.dogs[dog.id].delete().then(revalidator.revalidate);
              }}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};
