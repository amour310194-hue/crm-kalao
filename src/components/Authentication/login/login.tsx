"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageWithBasePath from "@/core/common/imageWithBasePath";
import { all_routes } from "@/router/all_routes";
import { FormEvent, useState } from "react";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { mustEnrollMfa } from "@/lib/authz";
type PasswordField = "password" | "confirmPassword";

const Login = () => {
  const router = useRouter();
  const supabaseEnabled = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fails, setFails] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
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

    if (!supabaseEnabled) {
      setError(
        "Supabase n'est pas configuré. Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    if (Date.now() < lockedUntil) {
      setError("Trop d’essais. Réessayez dans un moment.");
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
        await fetch("/api/auth/login-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, success: false }),
        });
        const nextFails = fails + 1;
        setFails(nextFails);
        if (nextFails >= 5) setLockedUntil(Date.now() + 30_000);
        setError("Email ou mot de passe incorrect.");
        return;
      }
      setFails(0);
      const { data: sessionData } = await supabase.auth.getSession();
      let sessionId: string | null = null;
      try {
        const payloadB64 = sessionData.session?.access_token?.split(".")[1];
        if (payloadB64) {
          const json = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))) as {
            session_id?: string;
          };
          sessionId = json.session_id ?? null;
        }
      } catch {
        sessionId = null;
      }
      const eventRes = await fetch("/api/auth/login-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          success: true,
          sessionId,
        }),
      });
      const eventJson = (await eventRes.json().catch(() => ({}))) as { token?: string };
      if (eventJson.token) sessionStorage.setItem("kalao_cxn_token", eventJson.token);
      const userId = sessionData.session?.user.id;
      let role: string | null = null;
      if (userId) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
        role = profile?.role ?? null;
      }
      const aal = sessionData.session?.aal ?? "aal1";
      if (mustEnrollMfa(role, aal)) {
        router.push("/mfa-setup");
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
                <div className="text-center mb-4 auth-logo">
                  <ImageWithBasePath
                    src="assets/img/kalao-logo.png"
                    className="img-fluid"
                    alt="Groupe Kalao"
                  />
                </div>
                <div>
                  <div className="mb-3">
                    <h3 className="mb-2">Se connecter</h3>
                    <p className="mb-0">
                      {supabaseEnabled
                        ? "Connectez-vous avec votre compte Kalao."
                        : "Supabase n'est pas configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY."}
                    </p>
                  </div>
                  {error ? (
                    <div className="alert alert-danger py-2" role="alert">
                      {error}
                    </div>
                  ) : null}
                  <div className="mb-3">
                    <label className="form-label">Adresse email</label>
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
                    <label className="form-label">Mot de passe</label>
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
                        defaultChecked={false}
                        id="checkebox-md"
                      />
                      <label
                        className="form-check-label text-dark ms-1"
                        htmlFor="checkebox-md"
                      >
                        Se souvenir de moi
                      </label>
                    </div>
                    <div className="text-end">
                      <Link
                        href={all_routes.forgotPassword}
                        className="link-danger fw-medium link-hover"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Connexion…" : "Se connecter"}
                    </button>
                  </div>
                  <div className="mb-3">
                    <p className="mb-0">
                      Pas de compte ? Demandez à un admin ou au RH de le créer dans
                      l’annuaire du personnel.
                    </p>
                  </div>
                </div>
                <div className="text-center pb-4">
                  <p className="text-dark mb-0">
                    Copyright © {new Date().getFullYear()} — Groupe Kalao
                  </p>
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
