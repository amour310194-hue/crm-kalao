"use client";
/* eslint-disable @next/next/no-img-element */

import HeaderSearchmodal from "../header-searchModal/headerSearchmodal";
import ImageWithBasePath from "../imageWithBasePath";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { all_routes } from "@/router/all_routes";
import { setMiniSidebar, setMobileSidebar } from "@/core/redux/sidebarSlice";
import { toggleMiniSidebarDom } from "@/lib/mini-sidebar";
import { updateTheme } from "@/core/redux/themeSlice";
import Link from "next/link";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { fetchMyProfile } from "@/lib/crm";
import { ROLE_LABEL } from "@/lib/org";

/**
 * Aucune source de notifications n'existe encore côté base : les quatre entrées
 * du template sont masquées pour ne pas afficher une activité inventée. À passer
 * à true le jour où les notifications sont alimentées.
 */
const HAS_NOTIFICATIONS = false;

const Header = () => {

  const route = all_routes
  const dispatch = useDispatch();
  const themeSettings = useSelector((state: any) => state.theme.themeSettings);

  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };

  const miniSidebar = useSelector((state: any) => state.sidebarSlice.miniSidebar);
  const handleMiniSidebar = () => {
    const next = toggleMiniSidebarDom();
    dispatch(setMiniSidebar(next));
    dispatch(
      updateTheme({
        "data-layout": next ? "mini" : "default",
        "data-size": "default",
      })
    );
  };

  // Identité du compte connecté : le template affiche sinon un utilisateur fictif.
  const [account, setAccount] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      const meta = user.user_metadata ?? {};
      let name =
        (meta.full_name as string) ||
        (meta.name as string) ||
        user.email?.split("@")[0] ||
        "Compte Kalao";
      let role = "";
      try {
        const profile = await fetchMyProfile();
        if (profile?.full_name) name = profile.full_name;
        role =
          profile?.job_title ||
          (profile ? ROLE_LABEL[profile.role] ?? profile.role : "");
      } catch {
        role = "";
      }
      setAccount({ name, email: user.email ?? "", role });
    })();
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    }
  };

  const handleUpdateTheme = (key: string, value: string) => {
    if (themeSettings["dir"] === "rtl" && key !== "dir") {
      dispatch(updateTheme({ dir: "ltr" }));
    }
    dispatch(updateTheme({ [key]: value }));
  };

  useEffect(() => {
    const htmlElement: any = document.documentElement;
    Object.entries(themeSettings).forEach(([key, value]) => {
      if (key === "data-layout") return;
      htmlElement.setAttribute(key, value);
    });
  }, [themeSettings]);

  return (
    <>
      {/* Topbar Start */}
      <header className="navbar-header">
        <div className="page-container topbar-menu">
          <div className="d-flex align-items-center gap-2">
            {/* Logo */}
            <Link href={route.dashboard} className="logo">
              {/* Logo Normal */}
              <span className="logo-light">
                <span className="logo-lg">
                  <ImageWithBasePath src="assets/img/kalao-logo.png" alt="Groupe Kalao" />
                </span>
                <span className="logo-sm">
                  <ImageWithBasePath
                    src="assets/img/kalao-mark.jpg"
                    alt="Groupe Kalao"
                  />
                </span>
              </span>
              {/* Logo Dark */}
              <span className="logo-dark">
                <span className="logo-lg">
                  <ImageWithBasePath
                    src="assets/img/kalao-logo.png"
                    alt="Groupe Kalao"
                  />
                </span>
              </span>
            </Link>
            {/* Sidebar Mobile Button */}
            <Link
              id="mobile_btn"
              className="mobile-btn"
              href="#"
                  onClick={toggleMobileSidebar}
            >
              <i className="ti ti-menu-deep fs-24" />
            </Link>
            <button
              type="button"
              className="sidenav-toggle-btn btn border-0 p-0"
              id="toggle_btn2"
              aria-label={miniSidebar || themeSettings["data-layout"] === "mini" ? "Agrandir le menu" : "Réduire le menu"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleMiniSidebar();
              }}
            >
              <i className="ti ti-arrow-bar-to-right" />
            </button>
            {/* Search */}
            <div className="me-auto d-flex align-items-center header-search d-lg-flex d-none">
              {/* Search */}
              <div className="input-icon position-relative me-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher"
                />
                <span className="input-icon-addon d-inline-flex p-0 header-search-icon">
                  <i className="ti ti-command" />
                </span>
              </div>
              {/* /Search */}
            </div>
          </div>
          <div className="d-flex align-items-center">
            {/* Search for Mobile */}
            <div className="header-item d-flex d-lg-none me-2">
              <button
                className="topbar-link btn"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
                type="button"
              >
                <i className="ti ti-search fs-16" />
              </button>
            </div>
            {/* Minimize */}
            <div className="header-item">
              <div className="dropdown me-2">
                <Link
                  href="#"
                  className="btn topbar-link btnFullscreen"
                  onClick={toggleFullscreen}
                >
                  <i className="ti ti-maximize" />
                </Link>
              </div>
            </div>
            {/* Minimize */}
            {/* Light/Dark Mode Button */}
            <div className="header-item d-none d-sm-flex me-2">
              <Link
                href="#"
                id="dark-mode-toggle"
                className={`topbar-link btn btn-icon topbar-link header-togglebtn ${
                  themeSettings["data-bs-theme"] === "dark" ? "activate" : ""
                }`}
                onClick={() => handleUpdateTheme("data-bs-theme", "light")}
              >
                <i className="ti ti-sun fs-16" />
              </Link>
              {/* Light Mode Toggle */}
              <Link
                href="#"
                id="light-mode-toggle"
                className={`topbar-link btn btn-icon topbar-link header-togglebtn ${
                  themeSettings["data-bs-theme"] === "light" ? "activate" : ""
                }`}
                onClick={() => handleUpdateTheme("data-bs-theme", "dark")}
              >
                <i className="ti ti-moon fs-16" />
              </Link>
            </div>
            {/* pages */}
            <div className="header-item d-none d-sm-flex">
              <div className="dropdown me-2">
                <Link
                  href="#"
                  className="btn topbar-link topbar-teal-link"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-layout-grid-add" />
                </Link>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                  {/* Item*/}
                  <Link href={route.contactGrid} className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Contacts
                        </span>
                        <span className="fs-13">Tous les contacts</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark" />
                    </div>
                  </Link>
                  {/* Item*/}
                  <Link href={route.InvoiceList} className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Factures
                        </span>
                        <span className="fs-13">Suivi de caisse</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark" />
                    </div>
                  </Link>
                  {/* Item*/}
                  <Link href={route.activities} className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Activités
                        </span>
                        <span className="fs-13">Tâches et relances</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark" />
                    </div>
                  </Link>
                  {/* Item*/}
                  <Link href={`${route.projectsGrid}?kind=visa`} className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Visas
                        </span>
                        <span className="fs-13">Dossiers d’immigration</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            {/* faq */}
              <div className="header-item d-none">
              <div className="dropdown me-2">
                <Link
                  href={route.leadReports}
                  className="btn topbar-link topbar-warning-link"
                >
                  <i className="ti ti-chart-pie" />
                </Link>
              </div>
            </div>
            <div className="header-line" />
            {/* message */}
            <div className="header-item">
              <div className="dropdown me-2">
                <Link href={route.email} className="btn topbar-link">
                  <i className="ti ti-message-circle-exclamation" />
                </Link>
              </div>
            </div>
            {/* Notification Dropdown */}
            <div className="header-item">
              <div className="dropdown me-2">
                <button
                  className="topbar-link btn topbar-link dropdown-toggle drop-arrow-none"
                  data-bs-toggle="dropdown"
                  data-bs-offset="0,24"
                  type="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <i className="ti ti-bell-check fs-16 animate-ring" />
                  <span className={`badge rounded-pill${HAS_NOTIFICATIONS ? "" : " d-none"}`}>
                    10
                  </span>
                </button>
                <div
                  className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg"
                  style={{ minHeight: 300 }}
                >
                  <div className="p-2 border-bottom">
                    <div className="row align-items-center">
                      <div className="col">
                        <h6 className="m-0 fs-16 fw-semibold">
                          {" "}
                          Notifications
                        </h6>
                      </div>
                    </div>
                  </div>
                  {/* Notification Body */}
                  <div
                    className="notification-body position-relative z-2 rounded-0"
                    data-simplebar=""
                  >
                    <p className="text-center text-muted py-4 mb-0">
                      Aucune notification pour le moment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* User Dropdown */}
            <div className="dropdown profile-dropdown d-flex align-items-center justify-content-center">
              <Link
                href="#"
                className="topbar-link dropdown-toggle drop-arrow-none position-relative"
                data-bs-toggle="dropdown"
                data-bs-offset="0,22"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <ImageWithBasePath
                  src="assets/img/users/user-40.jpg"
                  width={38}
                  className="rounded-1 d-flex"
                  alt="user-image"
                />
                <span className="online text-success">
                  <i className="ti ti-circle-filled d-flex bg-white rounded-circle border border-1 border-white" />
                </span>
              </Link>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                <div className="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
                  <ImageWithBasePath
                    src="assets/img/users/user-40.jpg"
                    className="rounded-circle"
                    width={42}
                    height={42}
                    alt=""
                  />
                  <div className="ms-2">
                    {account ? (
                      <p className="fw-medium text-dark mb-0">{account.name}</p>
                    ) : (
                      <p className="fw-medium text-dark mb-0">Compte Kalao</p>
                    )}
                    {account ? (
                      <span className="d-block fs-13">
                        {account.email}
                        {account.role ? ` - ${account.role}` : ""}
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* Item*/}
                <Link href={route.profile} className="dropdown-item">
                  <i className="ti ti-user-circle me-1 align-middle" />
                  <span className="align-middle">Compte</span>
                </Link>
                {/* Item*/}
                <Link href={route.profile} className="dropdown-item">
                  <i className="ti ti-settings me-1 align-middle" />
                  <span className="align-middle">Paramètres</span>
                </Link>
                {/* Item*/}
                <div className="pt-2 mt-2 border-top">
                  <Link
                    href={route.login}
                    className="dropdown-item text-danger"
                    onClick={async (event) => {
                      event.preventDefault();
                      if (isSupabaseConfigured()) {
                        await getSupabaseBrowserClient().auth.signOut();
                      }
                      window.location.assign(route.login);
                    }}
                  >
                    <i className="ti ti-logout me-1 fs-17 align-middle" />
                  <span className="align-middle">Déconnexion</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Topbar End */}
      <HeaderSearchmodal />
    </>
  );
};

export default Header;
