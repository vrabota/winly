import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import type { PropsWithChildren } from 'react';
import type { LinkProps } from 'next/link';

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

const NavLink = ({ children, activeClassName, className, ...props }: PropsWithChildren<ActiveLinkProps>) => {
  const { asPath, isReady } = useRouter();
  const [computedClassName, setComputedClassName] = useState(className);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL((props.as || props.href) as string, location.href).pathname;

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname;

      const newClassName =
        linkPathname === `/${activePathname.split('/')[1]}` ? `${className} ${activeClassName}`.trim() : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [asPath, isReady, props.as, props.href, activeClassName, className, computedClassName]);

  return (
    <Link className={computedClassName} {...props}>
      {children}
    </Link>
  );
};

export default NavLink;
