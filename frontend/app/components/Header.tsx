import { useTheme, validThemes } from "~/providers/theme.provider";
import { SelectDropdown } from "./SelectDropdown";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="navbar bg-primary">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
        </div>
        <a
          className="btn btn-ghost normal-case text-xl"
          href="https://github.com/jjhiggz/elysia-remix-demo/"
        >
          Elysia Remix Demo
        </a>
      </div>
      <div className="navbar-end">
        <SelectDropdown
          options={validThemes}
          initialValue={theme}
          onChange={(newTheme) => setTheme(newTheme)}
        />
      </div>
    </div>
  );
};
