import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

export default function ButtonLink({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex text-center w-50 h-12 border-2 border-pub-orange items-center justify-center rounded-lg bg-pub-beige px-4 py-2 text-[1em] font-semibold text-pub-orange transition duration-500 hover:bg-pub-orange hover:text-pub-beige"
    >
      {label}
    </Link>
  );
}
