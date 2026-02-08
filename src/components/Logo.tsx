import Image from "next/image";

export default function Logo({
  width,
  height,
  src,
}: {
  width: number;
  height: number;
  src: string;
}) {
  return (
    <Image
      src={src}
      alt="PubQuiz Logo"
      width={width}
      height={height}
      unoptimized
      className="hover:scale-105 transition-transform hover:brightness-110 duration-500"
      priority
    />
  );
}