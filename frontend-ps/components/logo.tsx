import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        alt="Prophecy Sunya Logo"
        className="rounded-full"
        height="36"
        width="36"
        quality={100}
      />
      <span className="text-xl font-bold text-muted-foreground">
        ProphecySunya
      </span>
    </Link>
  );
};

export default Logo;
