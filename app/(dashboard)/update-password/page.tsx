import UpdatePassword from "@/components/auth/update-password";
import { Logo } from "@/components/builder/logo";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

type PasswordType = "set" | "reset" | "change";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { type?: PasswordType };
}) {
  const { type = "set" } = await searchParams;
  const title = {
    set: "Set your password",
    reset: "Reset your password",
    change: "Change your password",
  }[type];

  const description = {
    set: "Set a password for your account to enhance security",
    reset: "Enter your new password below",
    change: "Enter your new password below",
  }[type];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo shouldRedirect={false} />
            <span className="ml-2 text-xl font-bold tracking-wide uppercase">
              Chai Builder
            </span>
          </div>
          <Link
            href="/sites"
            className="text-sm text-fuchsia-500 hover:text-fuchsia-700 flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to websites
          </Link>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="max-w-lg min-w-96 border bg-white rounded-lg p-8">
          <div className="pb-8">
            <div className="flex justify-center mb-8">
              <Logo width={50} height={50} shouldRedirect={false} />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>

            <p className="mt-2 text-center text-sm text-gray-600">
              {description}
            </p>
          </div>
          <UpdatePassword type={type} />
        </div>
      </div>
    </div>
  );
}
