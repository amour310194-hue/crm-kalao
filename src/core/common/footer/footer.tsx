"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";


const Footer = () => {
  return (
    <>
      {/* Start Footer */}
      <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
        <p className="mb-md-0 mb-1">
          Copyright © {new Date().getFullYear()}
          <Link
            href="#"
            className="ms-1 link-primary text-decoration-underline"
          >
            CRMS
          </Link>
        </p>
        <div className="d-flex align-items-center gap-2 footer-links justify-content-center justify-content-md-end">
          <Link href="#">About</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Contact Us</Link>
        </div>
      </footer>
      {/* End Footer */}
    </>
  );
};

export default Footer;
