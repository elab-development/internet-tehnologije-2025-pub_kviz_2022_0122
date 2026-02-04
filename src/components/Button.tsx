// components/ui/ButtonLink.tsx
import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

export default function ButtonLink({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
    >
      {label}
    </Link>
  );
}
