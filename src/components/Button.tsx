import { MouseEventHandler, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren & {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
  children,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <>
      <button
        className={`${className} rounded-md bg-pink-500 p-2 outline-none duration-200 ease-in-out hover:text-gray-500 hover:transition focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 focus:ring-offset-stone-800`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}
