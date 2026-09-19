"use client";

import Footer from "@/core/common/footer/footer";
import PageHeader from "@/core/common/page-header/pageHeader";
import FileManagerLive from "@/components/Pages/kalao/FileManagerLive";

const FileManagerComponent = () => {
  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader title="File Manager" showModuleTile={true} moduleTitle="Application" showExport={false} />
        <FileManagerLive />
      </div>
      <Footer />
    </div>
  );
};

export default FileManagerComponent;
