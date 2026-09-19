
import { all_routes } from '@/router/all_routes';
import Link from 'next/link';
import { useState, useEffect } from 'react';


interface PageHeaderProps {
  title?: string;
  badgeCount?: any;
  showExport?: boolean;
  moduleTitle?: string;
  showModuleTile:any;
  /** Optional control rendered at the start of the right-hand button group (e.g. a date-range picker). */
  headerExtra?: React.ReactNode;
}

const PageHeader = ({ title = "", badgeCount = null, showExport = false, moduleTitle = "", showModuleTile = true, headerExtra }: PageHeaderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Initialize Bootstrap tooltips
    // @ts-ignore
    if (window.bootstrap) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        // @ts-ignore
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, []);

  const handleCollapseToggle = () => {
    const body = document.body;

    if (isCollapsed) {
      body.classList.remove('header-collapse');
    } else {
      body.classList.add('header-collapse');
    }

    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
      <div>
        <h4 className="mb-1">
          {title}
          <span className="badge badge-soft-primary ms-2">{badgeCount}</span>
        </h4>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 p-0">
            <li className="breadcrumb-item">
              <Link href={all_routes.dealsDashboard}>Home</Link>
            </li>
            {showModuleTile && (
            <li className="breadcrumb-item" aria-current="page">
              <Link href="#">{moduleTitle}</Link>
            </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>
      </div>

      <div className="gap-2 d-flex align-items-center flex-wrap">
        {headerExtra}
        {showExport && (
          <div className="dropdown">
            <Link
              href="#"
              className="dropdown-toggle btn btn-outline-light px-2 shadow"
              data-bs-toggle="dropdown"
            >
              <i className="ti ti-package-export me-2" />
              Export
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <ul>
                <li>
                  <Link href="#" className="dropdown-item">
                    <i className="ti ti-file-type-pdf me-1" />
                    Export as PDF
                  </Link>
                </li>
                <li>
                  <Link href="#" className="dropdown-item">
                    <i className="ti ti-file-type-xls me-1" />
                    Export as Excel
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        <Link
          href="#"
          className="btn btn-icon btn-outline-light shadow"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title="Refresh"
          aria-label="Refresh"
        >
          <i className="ti ti-refresh" />
        </Link>

        <Link
          href="#"
          id='collapse-header'
          onClick={handleCollapseToggle}
          className={`btn btn-icon btn-outline-light shadow ${isCollapsed === true ? 'active' : ''}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-title={isCollapsed ? "Expand" : "Collapse"}
          aria-label="Collapse"
        >
          <i className="ti ti-transition-top" />
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;
