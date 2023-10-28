import type { ComponentProps } from "react";

export const TextInput = ({
  label,
  labelProps,
  inputProps,
}: {
  label: string;
  labelProps: ComponentProps<"label">;
  inputProps: ComponentProps<"input">;
}) => {
  return (
    <div className="flex flex-col justify-start text-start">
      <label {...labelProps}>{label.toUpperCase()}:</label>
      <input {...inputProps} className="p-2 text-lg" />
    </div>
  );
};
