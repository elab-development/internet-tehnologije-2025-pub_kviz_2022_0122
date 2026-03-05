import Link from "next/link";

type Props = {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  type?: "button" | "submit";
  disabled?: boolean;
  delete?: boolean;
};

export default function Button({
  href,
  label,
  onClick,
  type = "button",
  disabled,
  delete: isDelete,
}: Props) {
  const baseStyles =
    "inline-flex text-center rounded-4xl w-45 h-12 items-center justify-center px-4 py-2 text-[1em] font-semibold transition duration-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const normalStyles =
    "border border-pub-orange bg-white/5 text-pub-orange hover:bg-pub-orange/70 hover:text-pub-beige";

  const deleteStyles =
    "border border-red-500 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white";

  const styles = `${baseStyles} ${isDelete ? deleteStyles : normalStyles}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {label}
    </button>
  );
}
