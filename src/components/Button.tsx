import Link from "next/link";

type Props = {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  href,
  label,
  onClick,
  type = "button",
  disabled,
}: Props) {
  const styles =
    "inline-flex text-center rounded-lg w-50 h-12 border-2 border-pub-orange items-center justify-center bg-pub-beige px-4 py-2 text-[1em] font-semibold text-black/80 transition duration-500 hover:bg-pub-orange/70 hover:text-pub-beige cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

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
