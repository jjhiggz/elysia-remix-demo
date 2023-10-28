import { toast } from "react-toastify";
import { SignInForm } from "~/components/SignInForm";
import { treaty } from "~/treaty";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center pt-5 font-monospace gap-10 h-full flex-1 ">
      <SignInForm
        onSubmit={(loginUserDto) => {
          return treaty.auth["sign-in"].post(loginUserDto).catch((e) => {
            console.error(e);
            toast.error("Something went wrong 😥");
          });
        }}
      />
    </div>
  );
};

export default SignInPage;
