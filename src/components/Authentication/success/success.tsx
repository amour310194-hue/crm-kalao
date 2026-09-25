"use client";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common/imageWithBasePath";

/*
  Password-reset confirmation screen (html/success.html).

  `resetPassword.tsx` already links here via all_routes.success - the route key
  existed but had no component behind it until now.
*/
const SuccessComponent = () => (
  <div className="overflow-hidden p-3 acc-vh">
    {/* start row */}
    <div className="row vh-100 w-100 g-0">
      <div className="col-lg-6 vh-100 overflow-y-auto overflow-x-hidden">
        <form className=" vh-100 d-flex justify-content-between flex-column p-4 pb-0">
          <div className="text-center mb-4 auth-logo">
            <ImageWithBasePath
              src="assets/img/kalao-logo.png"
              className="img-fluid"
              alt="Logo"
            />
          </div>
          <div>
            <div className="text-center mb-3">
              <span className="avatar avatar-xl rounded-circle bg-success mb-4">
                <i className="ti ti-check fs-26" />
              </span>
              <h4 className="mb-1">Success</h4>
              <p className="mb-0">Your Passwrod Reset Successfully!</p>
            </div>
            <div className="mb-3">
              <Link href={all_routes.login} className="btn btn-primary w-100">
                Back to Login
              </Link>
            </div>
          </div>
          <div className="text-center pb-4">
            <p className="text-dark mb-0">Copyright © 2025 - CRMS</p>
          </div>
        </form>
      </div>
      <div className="col-lg-6 account-bg-07" /> {/* end col */}
    </div>
    {/* end row */}
  </div>
);

export default SuccessComponent;
