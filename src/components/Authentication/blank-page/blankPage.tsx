"use client";
/* eslint-disable @next/next/no-img-element */
import Footer from "@/core/common/footer/footer"
import PageHeader from "@/core/common/page-header/pageHeader"


const BlankPageComponents = () => {
  return (
   <>
  {/* ========================
			Start Page Content
		========================= */}
  <div className="page-wrapper">
    {/* Start Content */}
    <div className="content">
      {/* Page Header */}
     <PageHeader title="Blank Page" showModuleTile={false} showExport={false} />
      {/* End Page Header */}
    </div>
    {/* End Content */}
    {/* Start Footer */}
    <Footer/>
    {/* End Footer */}
  </div>
  {/* ========================
			End Page Content
		========================= */}
</>

  )
}

export default BlankPageComponents