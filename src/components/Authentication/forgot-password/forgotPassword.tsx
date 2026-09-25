import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";
import KalaoForgotPassword from "@/components/auth/KalaoForgotPassword";

const ForgotPasswordComponents = () => {
  return (
    <div className="overflow-hidden p-3 acc-vh">
      <div className="row vh-100 w-100 g-0">
        <div className="col-lg-6 vh-100 overflow-y-auto overflow-x-hidden">
          <div className="row">
            <div className="col-md-10 mx-auto">
              <div className="vh-100 d-flex justify-content-between flex-column p-4 pb-0">
                <div className="text-center mb-4 auth-logo">
                  <ImageWithBasePath
                    src="assets/img/kalao-logo.png"
                    className="img-fluid"
                    alt="Groupe Kalao"
                  />
                </div>
                <div>
                  <div className="mb-3">
                    <h3 className="mb-2">Mot de passe oublié</h3>
                    <p className="mb-0">
                      Saisissez votre e-mail professionnel. Un code valable 15
                      minutes vous sera envoyé si le compte existe.
                    </p>
                  </div>
                  <KalaoForgotPassword />
                  <p className="mt-3 mb-0">
                    <Link href={all_routes.login} className="link-indigo fw-bold link-hover">
                      Retour à la connexion
                    </Link>
                  </p>
                </div>
                <div className="text-center pb-4">
                  <p className="text-dark mb-0">
                    Copyright © {new Date().getFullYear()} — Groupe Kalao
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-none d-lg-block account-bg-03" />
      </div>
    </div>
  );
};

export default ForgotPasswordComponents;
