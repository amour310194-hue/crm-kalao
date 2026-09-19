"use client";

import Link from "next/link";
import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";

type AppUnavailableProps = {
  title: string;
  reason: string;
  href: string;
  hrefLabel: string;
};

const AppUnavailable = ({ title, reason, href, hrefLabel }: AppUnavailableProps) => {
  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader title={title} showModuleTile={true} moduleTitle="Application" showExport={false} />
        <div className="card">
          <div className="card-body py-5 text-center">
            <h5 className="mb-2">{title} indisponible</h5>
            <p className="text-muted mb-4">{reason}</p>
            <Link href={href} className="btn btn-primary">
              {hrefLabel}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppUnavailable;
