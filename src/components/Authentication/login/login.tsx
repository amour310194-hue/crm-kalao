"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import { FormEvent, useState } from "react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  TEST_SUPER_ADMIN,
  isTestSuperAdmin,
  setLocalSession,
} from "@/lib/auth/session";
type PasswordField = "password" | "confirmPassword";

const Login = () => {
  const { t } = useI18n();
  const router = useRouter();
  const supabaseEnabled = isSupabaseConfigured();
  const [email, setEmail] = useState(TEST_SUPER_ADMIN.email);
  const [password, setPassword] = useState(TEST_SUPER_ADMIN.password);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isTestSuperAdmin(email, password)) {
      setLocalSession({
        email: TEST_SUPER_ADMIN.email,
        fullName: TEST_SUPER_ADMIN.fullName,
        role: TEST_SUPER_ADMIN.role,
      });
      router.push(all_routes.dashboard);
      return;
    }

    if (!supabaseEnabled) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("Email ou mot de passe incorrect.");
        return;
      }
      router.push(all_routes.dashboard);
    } catch {
      setError("Impossible de se connecter. Vérifiez la configuration Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden p-3 acc-vh">
      {/* start row */}
      <div className="row vh-100 w-100 g-0">
        <div className="col-lg-6 vh-100 overflow-y-auto overflow-x-hidden">
          {/* start row */}
          <div className="row">
            <div className="col-md-10 mx-auto">
              <form
                className=" vh-100 d-flex justify-content-between flex-column p-4 pb-0"
                onSubmit={handleSubmit}
              >
                <div className="d-flex justify-content-end mb-3">
                  <LanguageSwitcher />
                </div>
                <div className="text-center mb-4 auth-logo">
                  <ImageWithBasePath
                    src="assets/img/logo.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </div>
                <div>
                  <div className="mb-3">
                    <h3 className="mb-2">Connexion</h3>
                    <p className="mb-0">
                      Compte test Super Admin prérempli. Cliquez sur Connexion
                      pour entrer.
                    </p>
                    <div className="alert alert-info py-2 mt-3 mb-0 fs-13">
                      <strong>Email :</strong> {TEST_SUPER_ADMIN.email}
                      <br />
                      <strong>Mot de passe :</strong> {TEST_SUPER_ADMIN.password}
                    </div>
                  </div>
                  {error ? (
                    <div className="alert alert-danger py-2" role="alert">
                      {error}
                    </div>
                  ) : null}
                  <div className="mb-3">
                    <label className="form-label">{t("Email Address")}</label>
                    <div className="input-group input-group-flat">
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        autoComplete="email"
                      />
                      <span className="input-group-text">
                        <i className="ti ti-mail" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t("Password")}</label>
                    <div className="input-group input-group-flat pass-group">
                      <input
                        type={passwordVisibility.password ? "text" : "password"}
                        className="form-control pass-input"
                        placeholder="****************"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <span
                        className={`ti toggle-password input-group-text toggle-password ${
                          passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                        }`}
                        onClick={() => togglePasswordVisibility("password")}
                      ></span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="form-check form-check-md d-flex align-items-center">
                      <input
                        className="form-check-input mt-0"
                        type="checkbox"
                        defaultValue=""
                        id="checkebox-md"
                        defaultChecked
                      />
                      <label
                        className="form-check-label text-dark ms-1"
                        htmlFor="checkebox-md"
                      >
                        {t("Remember Me")}
                      </label>
                    </div>
                    <div className="text-end">
                      <Link
                        href={all_routes.forgotPassword}
                        className="link-danger fw-medium link-hover"
                      >
                        {t("Forgot Password?")}
                      </Link>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Connexion…" : "Connexion"}
                    </button>
                  </div>
                  <div className="mb-3">
                    <p className="mb-0">
                      {t("New on our platform?")}
                      <Link
                        href={all_routes.register}
                        className="link-indigo fw-bold link-hover"
                      >
                        {" "}
                        {t("Create an account")}
                      </Link>
                    </p>
                  </div>
                  <div className="or-login text-center position-relative mb-3">
                    <h6 className="fs-14 mb-0 position-relative text-body">
                      {t("OR")}
                    </h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
                    <div className="text-center flex-fill">
                      <Link
                        href="#"
                        className="p-2 btn btn-info d-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="img-fluid m-1"
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </div>
                    <div className="text-center flex-fill">
                      <Link
                        href="#"
                        className="p-2 btn btn-outline-light d-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="img-fluid  m-1"
                          src="assets/img/icons/google-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </div>
                    <div className="text-center flex-fill">
                      <Link
                        href="#"
                        className="p-2 btn btn-dark d-flex align-items-center justify-content-center"
                      >
                        <ImageWithBasePath
                          className="img-fluid  m-1"
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="text-center pb-4">
                  <p className="text-dark mb-0">Copyright © {new Date().getFullYear()} — Groupe Kalao</p>
                </div>
              </form>
            </div>{" "}
            {/* end col */}
          </div>
          {/* end row */}
        </div>
        <div className="col-lg-6 account-bg-01" /> {/* end col */}
      </div>
      {/* end row */}
    </div>
  );
};

export default Login;
