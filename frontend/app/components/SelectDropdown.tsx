export const SelectDropdown = <T extends string>({
  initialValue,
  options,
  onChange,
}: {
  initialValue?: T;
  options: T[] | readonly T[];
  onChange?: (newOption: T) => void;
}) => {
  return (
    <div className="form-control ">
      <select
        className="select select-bordered select-sm"
        onChange={(e) => {
          //@ts-ignore
          onChange?.(e.target.value);
        }}
      >
        {!initialValue && (
          <option disabled selected>
            Pick one
          </option>
        )}
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};
