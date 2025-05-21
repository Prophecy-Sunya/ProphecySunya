import { siteConfig } from '@/config/site';
import NextLink from 'next/link';
import clsx from 'clsx';
import { link as linkStyles } from '@heroui/theme';

export const Footer = () => {
  return (
    <footer className="text-sm border-t border-gray-800 px-8 w-full flex flex-col items-center justify-center py-4 gap-4">
      <ul className="hidden lg:flex gap-4 justify-start ml-2">
        {siteConfig.footerNavItems.map((item) => (
          <NextLink
            className={clsx(
              linkStyles({ color: 'foreground' }),
              'data-[active=true]:text-primary data-[active=true]:font-medium'
            )}
            color="foreground"
            href={item.href}
          >
            {item.label}
          </NextLink>
        ))}
      </ul>
      <p>© 2025 ProphecySunya. All rights reserved.</p>
    </footer>
  );
};
