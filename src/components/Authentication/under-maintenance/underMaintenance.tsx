"use client";
/* eslint-disable @next/next/no-img-element */
import ImageWithBasePath from "@/core/common/imageWithBasePath"
import { all_routes } from "@/router/all_routes";
import Link from "next/link";



const UnderMaintenanceComponent = () => {
  return (
    <div className="container">
  {/* start row */}
  <div className="row justify-content-center align-items-center vh-100">
    <div className="col-md-8 d-flex align-items-center justify-content-center mx-auto">
      <div>
        <div className="error-img mb-4">
          <ImageWithBasePath
            src="assets/img/authentication/maintenance-img.png"
            className="img-fluid"
            alt=""
          />
        </div>
        <div className="text-center">
          <h2 className="mb-3">We are Under Maintenance</h2>
          <p className="mb-3">
            Sorry for any inconvenience caused, we have almost <br /> done Will
            get back soon!
          </p>
          <div className="pb-4">
            <Link href={all_routes.dealsDashboard} className="btn btn-primary">
              <i className="ti ti-chevron-left me-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>{" "}
    {/* end col */}
  </div>
  {/* end row */}
</div>

  )
}

export default UnderMaintenanceComponent