import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-4 ">
      <div className="relative size-12">
        <Image
          src={logo}
          alt="Prophecy Sunya Logo"
          fill
          className="w-full h-full object-contain"
          quality={100}
        />
      </div>
      <span className="hidden md:block text-xl font-bold text-muted-foreground">
        ProphecySunya
      </span>
    </Link>
  );
};

export default Logo;
