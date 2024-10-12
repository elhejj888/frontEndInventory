'use client';
// components/Breadcrumb.js
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { capitalize } from 'lodash'; // Optional, to capitalize the breadcrumb

const Breadcrumb = ({ setPageTitle }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);

  const pageTitle = capitalize(pathSegments[pathSegments.length - 1]?.replace('-', ' ') || 'Dashboard');
  
  // Set the page title dynamically
  setPageTitle(pageTitle);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return (
      <span key={path}>
        <Link href={path}>
          {capitalize(segment.replace('-', ' '))} {/* Capitalizes and replaces dashes with spaces */}
        </Link>
        {index < pathSegments.length - 1 && ' -> '}
      </span>
    );
  });

  return (
    <nav aria-label="breadcrumb">
      <Link href="/">Home</Link>
      {breadcrumbItems.length > 0 && ' -> '}
      {breadcrumbItems}
    </nav>
  );
};

export default Breadcrumb;
