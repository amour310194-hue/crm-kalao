"use client";
import Link from "next/link";
import { useMemo, useState } from 'react'
import { all_routes } from "@/router/all_routes";

const route = all_routes;

type NodeKind = "contact" | "deal" | "owner" | "project" | "company";
type Strength = "strong" | "good" | "neutral" | "weak" | "risk";

interface RelDeal {
  name: string;
  value: string;
}

interface RelNode {
  id: string;
  kind: NodeKind;
  name: string;
  title: string;
  dept: string;
  role: string;
  strength: Strength;
  active: boolean;
  email?: string;
  phone?: string;
  last?: string;
  days?: number;
  owner?: string;
  deals?: RelDeal[];
  acts?: string[];
  next?: string;
  meta?: string;
  link?: keyof typeof route;
}

const STRENGTH: Record<Strength, { label: string; cls: string }> = {
  strong: { label: "Strong", cls: "is-strong" },
  good: { label: "Good", cls: "is-good" },
  neutral: { label: "Neutral", cls: "is-neutral" },
  weak: { label: "Weak", cls: "is-weak" },
  risk: { label: "At Risk", cls: "is-risk" },
};

const NODES: RelNode[] = [
  {
    id: "c1", kind: "contact", name: "Ellis Vandermeer", title: "Chief Financial Officer",
    dept: "Finance", role: "Decision Maker", strength: "strong", active: true,
    email: "e.vandermeer@halcyon.partners", phone: "+1 312 555 0119",
    last: "6 hours ago", days: 0, owner: "Tomas Lindqvist",
    deals: [{ name: "Halcyon Partners - Pilot", value: "FCFA 128,000" }],
    acts: ["Asked about multi-year contract terms", "Attended the executive briefing", "Joined the pricing call"],
    next: "Send the multi-year pricing proposal today",
  },
  {
    id: "c2", kind: "contact", name: "Dana Reyes", title: "Chief Technology Officer",
    dept: "Technology", role: "Technical Contact", strength: "good", active: true,
    email: "d.reyes@halcyon.partners", phone: "+1 312 555 0164",
    last: "2 days ago", days: 2, owner: "Tomas Lindqvist",
    deals: [{ name: "Halcyon Partners - Pilot", value: "FCFA 128,000" }],
    acts: ["Raised SSO and data-residency questions", "Added to the deal thread"],
    next: "Book the technical deep-dive before the security review",
  },
  {
    id: "c3", kind: "contact", name: "Marcus Whitfield", title: "VP Operations",
    dept: "Operations", role: "Champion", strength: "strong", active: true,
    email: "m.whitfield@halcyon.partners", phone: "+1 415 555 0134",
    last: "1 day ago", days: 1, owner: "Adrian Herrera",
    deals: [{ name: "Halcyon Partners - Pilot", value: "FCFA 128,000" }],
    acts: ["Forwarded the proposal internally", "Requested a rollout timeline", "Viewed the pricing page 6 times"],
    next: "Equip the champion with the internal business case deck",
  },
  {
    id: "c4", kind: "contact", name: "Sofia Marchetti", title: "Procurement Lead",
    dept: "Finance", role: "Blocker", strength: "risk", active: true,
    email: "s.marchetti@halcyon.partners", phone: "+39 02 5550 921",
    last: "23 days ago", days: 23, owner: "Tomas Lindqvist",
    deals: [],
    acts: ["Queried the per-seat pricing model", "Requested three competing quotes"],
    next: "Address the pricing-model objection before the contract stage",
  },
  {
    id: "c5", kind: "contact", name: "Priya Raghunathan", title: "Head of IT Operations",
    dept: "Technology", role: "User", strength: "neutral", active: true,
    email: "p.raghunathan@halcyon.partners", phone: "+1 617 555 0188",
    last: "11 days ago", days: 11, owner: "Adrian Herrera",
    deals: [],
    acts: ["Attended the product walkthrough"],
    next: "Invite to onboarding planning to build usage buy-in",
  },
  {
    id: "c6", kind: "contact", name: "Nadia Okonkwo", title: "Group COO",
    dept: "Executive", role: "Executive Sponsor", strength: "weak", active: true,
    email: "n.okonkwo@halcyon.partners", phone: "+44 20 5550 173",
    last: "34 days ago", days: 34, owner: "Tomas Lindqvist",
    deals: [],
    acts: ["Attended the executive briefing"],
    next: "Re-engage the sponsor - no contact in over a month on a FCFA 128K deal",
  },
  {
    id: "c7", kind: "contact", name: "Tomas Berg", title: "Financial Controller",
    dept: "Finance", role: "Finance", strength: "good", active: false,
    email: "t.berg@halcyon.partners", phone: "+46 8 555 0142",
    last: "18 days ago", days: 18, owner: "Ellis Vandermeer",
    deals: [],
    acts: ["Reviewed the invoicing schedule"],
    next: "Confirm the PO process ahead of contract signature",
  },
  {
    id: "d1", kind: "deal", name: "Halcyon Partners - Pilot", title: "Open deal",
    dept: "-", role: "Open Deal", strength: "strong", active: true,
    meta: "FCFA 128,000 · Negotiation · 74% · closes 19 Sep 2026", link: "dealsDetails",
  },
  {
    id: "d2", kind: "deal", name: "Halcyon - Support Renewal", title: "Open deal",
    dept: "-", role: "Open Deal", strength: "good", active: true,
    meta: "FCFA 34,000 · Contract Review · 88% · closes 02 Oct 2026", link: "dealsDetails",
  },
  {
    id: "o1", kind: "owner", name: "Tomas Lindqvist", title: "Account owner",
    dept: "Enterprise Sales", role: "Account Owner", strength: "strong", active: true,
    meta: "Owns 4 of 7 relationships on this account", link: "staffDirectoryGrid",
  },
  {
    id: "p1", kind: "project", name: "Pilot Implementation", title: "Project",
    dept: "Delivery", role: "Project", strength: "good", active: true,
    meta: "In progress · 62% complete · due 14 Oct 2026", link: "projectDetails",
  },
  {
    id: "co1", kind: "company", name: "Halcyon Nordics AB", title: "Subsidiary",
    dept: "-", role: "Child Company", strength: "neutral", active: true,
    meta: "48 employees · Stockholm · 1 open deal", link: "companiesDetails",
  },
];

interface RelFilters {
  role: string;
  dept: string;
  strength: string;
  deal: string;
  owner: string;
  status: string;
}

const DEFAULT_FILTERS: RelFilters = {
  role: "all", dept: "all", strength: "all", deal: "all", owner: "all", status: "all",
};

function isVisible(n: RelNode, f: RelFilters) {
  if (f.role !== "all" && n.role !== f.role) return false;
  if (f.dept !== "all" && n.dept !== f.dept) return false;
  if (f.strength !== "all" && n.strength !== f.strength) return false;
  if (f.owner !== "all" && n.kind === "contact" && n.owner !== f.owner) return false;
  if (f.status === "active" && !n.active) return false;
  if (f.status === "inactive" && n.active) return false;
  if (f.deal !== "all") {
    if (n.kind === "contact") {
      if (!(n.deals || []).some((d) => d.name === f.deal)) return false;
    } else if (n.kind === "deal" && n.name !== f.deal) {
      return false;
    }
  }
  return true;
}

interface Positioned extends RelNode {
  x: number;
  y: number;
}

const RelationshipMapComponent = () => {
  const [filters, setFilters] = useState<RelFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"graph" | "hierarchy">("graph");

  const visibleNodes = useMemo(() => NODES.filter((n) => isVisible(n, filters)), [filters]);

  const positioned = useMemo<Positioned[]>(() => {
    const half = Math.ceil(visibleNodes.length / 2);
    const left = visibleNodes.slice(0, half);
    const right = visibleNodes.slice(half);
    const place = (list: RelNode[], x: number): Positioned[] =>
      list.map((n, i) => ({ ...n, x, y: ((i + 0.5) / list.length) * 100 }));
    return [...place(left, 26), ...place(right, 74)];
  }, [visibleNodes]);

  const selected = selectedId ? NODES.find((n) => n.id === selectedId) ?? null : null;

  const updateFilter = (key: keyof RelFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedId(null);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSelectedId(null);
  };

  return (
    <>
      {/* ========================
				Start Page Content
			========================= */}
      <div className="page-wrapper">
        {/* Start Content */}
        <div className="content">
          {/* Page Header */}
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
            <div>
              <h4 className="mb-1">Relationship Map</h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item">
                    <Link href={route.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href={route.companiesGrid}>Companies</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href={route.account360}>Halcyon Partners</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Relationship Map
                  </li>
                </ol>
              </nav>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <Link href={route.account360} className="btn btn-outline-light shadow">
                <i className="ti ti-layout-dashboard me-1" />
                Account 360
              </Link>
              <Link href={route.contactGrid} className="btn btn-outline-light shadow">
                <i className="ti ti-users me-1" />
                All Contacts
              </Link>
              <Link
                href="#"
                className="btn btn-icon btn-outline-light shadow"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                aria-label="Collapse"
                data-bs-original-title="Collapse"
                id="collapse-header"
              >
                <i className="ti ti-transition-top" />
              </Link>
            </div>
          </div>
          {/* End Page Header */}
          <div>
            {/* Filters */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="row g-2 align-items-end">
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <label className="form-label" htmlFor="rel_role">
                      Contact role
                    </label>
                    <select
                      className="form-select"
                      id="rel_role"
                      value={filters.role}
                      onChange={(e) => updateFilter("role", e.target.value)}
                    >
                      <option value="all">All roles</option>
                      <option value="Decision Maker">Decision Maker</option>
                      <option value="Champion">Champion</option>
                      <option value="Influencer">Influencer</option>
                      <option value="User">User</option>
                      <option value="Finance">Finance</option>
                      <option value="Technical Contact">Technical Contact</option>
                      <option value="Executive Sponsor">Executive Sponsor</option>
                      <option value="Blocker">Blocker</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <label className="form-label" htmlFor="rel_dept">
                      Department
                    </label>
                    <select
                      className="form-select"
                      id="rel_dept"
                      value={filters.dept}
                      onChange={(e) => updateFilter("dept", e.target.value)}
                    >
                      <option value="all">All departments</option>
                      <option value="Finance">Finance</option>
                      <option value="Technology">Technology</option>
                      <option value="Operations">Operations</option>
                      <option value="Executive">Executive</option>
                      <option value="Enterprise Sales">Enterprise Sales</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <label className="form-label" htmlFor="rel_strength">
                      Strength
                    </label>
                    <select
                      className="form-select"
                      id="rel_strength"
                      value={filters.strength}
                      onChange={(e) => updateFilter("strength", e.target.value)}
                    >
                      <option value="all">All strengths</option>
                      <option value="strong">Strong</option>
                      <option value="good">Good</option>
                      <option value="neutral">Neutral</option>
                      <option value="weak">Weak</option>
                      <option value="risk">At Risk</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <label className="form-label" htmlFor="rel_deal">
                      Deal
                    </label>
                    <select
                      className="form-select"
                      id="rel_deal"
                      value={filters.deal}
                      onChange={(e) => updateFilter("deal", e.target.value)}
                    >
                      <option value="all">All deals</option>
                      <option value="Halcyon Partners - Pilot">Halcyon Partners - Pilot</option>
                      <option value="Halcyon - Support Renewal">Halcyon - Support Renewal</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <label className="form-label" htmlFor="rel_owner">
                      Account owner
                    </label>
                    <select
                      className="form-select"
                      id="rel_owner"
                      value={filters.owner}
                      onChange={(e) => updateFilter("owner", e.target.value)}
                    >
                      <option value="all">All owners</option>
                      <option value="Tomas Lindqvist">Tomas Lindqvist</option>
                      <option value="Adrian Herrera">Adrian Herrera</option>
                      <option value="Ellis Vandermeer">Ellis Vandermeer</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-6">
                    <label className="form-label" htmlFor="rel_status">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="rel_status"
                      value={filters.status}
                      onChange={(e) => updateFilter("status", e.target.value)}
                    >
                      <option value="all">Active &amp; inactive</option>
                      <option value="active">Active only</option>
                      <option value="inactive">Inactive only</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
                  <span className="badge bg-light text-dark">
                    {visibleNodes.length} of {NODES.length} nodes
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light shadow"
                    onClick={resetFilters}
                  >
                    <i className="ti ti-filter-off me-1" />
                    Reset filters
                  </button>
                </div>
              </div>
            </div>
            {/* End Filters */}
            <div className="row g-3">
              {/* Map */}
              <div className="col-xxl-9">
                <div className="card mb-0">
                  <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
                    <div>
                      <h6 className="mb-0">
                        Halcyon Partners · Relationship Graph
                      </h6>
                      <p className="text-muted fs-12 mb-0">
                        Select any node to inspect the relationship
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <button
                        type="button"
                        className={`btn btn-sm btn-outline-light shadow${view === "graph" ? " active" : ""}`}
                        onClick={() => setView("graph")}
                      >
                        <i className="ti ti-affiliate me-1" />
                        Graph
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm btn-outline-light shadow${view === "hierarchy" ? " active" : ""}`}
                        onClick={() => setView("hierarchy")}
                      >
                        <i className="ti ti-sitemap me-1" />
                        Hierarchy
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    {/* Graph view */}
                    <div className={view === "graph" ? "" : "d-none"}>
                      <div className="relmap">
                        <svg
                          className="relmap-links"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          {positioned.map((n) => {
                            const s = STRENGTH[n.strength];
                            const cls = [
                              s.cls,
                              selectedId === n.id ? "is-selected" : "",
                              selectedId && selectedId !== n.id ? "is-dim" : "",
                            ].filter(Boolean).join(" ");
                            return (
                              <line
                                key={n.id}
                                x1="50"
                                y1="50"
                                x2={n.x}
                                y2={n.y}
                                className={cls}
                                vectorEffect="non-scaling-stroke"
                              />
                            );
                          })}
                        </svg>
                        <div className="relmap-center" style={{ left: "50%", top: "50%" }}>
                          <span className="avatar avatar-md rounded bg-soft-primary text-primary">
                            <i className="ti ti-building fs-20" />
                          </span>
                          <h6 className="mb-0 fs-14">Halcyon Partners</h6>
                          <span className="fs-11 text-muted">
                            Financial Services · 640 staff
                          </span>
                          <span className="badge bg-soft-success text-success">
                            Health 82
                          </span>
                        </div>
                        {positioned.map((n) => {
                          const s = STRENGTH[n.strength];
                          const cls = [
                            "relmap-node",
                            selectedId === n.id ? "is-selected" : "",
                            selectedId && selectedId !== n.id ? "is-dim" : "",
                          ].filter(Boolean).join(" ");
                          return (
                            <button
                              key={n.id}
                              type="button"
                              className={cls}
                              data-kind={n.kind}
                              style={{ left: `${n.x}%`, top: `${n.y}%` }}
                              onClick={() => setSelectedId(n.id)}
                            >
                              <h6 className="relmap-node-title">{n.name}</h6>
                              <span className="relmap-node-meta">
                                {n.kind === "contact" ? (
                                  <>
                                    {n.title}
                                    <br />
                                    <span className="badge bg-soft-primary text-primary mt-1">
                                      {n.role}
                                    </span>
                                  </>
                                ) : (
                                  n.meta || n.title
                                )}
                              </span>
                              <span className={`rel-strength ${s.cls} mt-1`}>{s.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      {visibleNodes.length === 0 && (
                        <div className="mt-3">
                          <div className="ai-empty">
                            <span className="ai-empty-icon">
                              <i className="ti ti-affiliate" />
                            </span>
                            <h6>No relationships match these filters</h6>
                            <p>
                              Try clearing a filter to bring nodes back onto the map.
                            </p>
                          </div>
                        </div>
                      )}
                      <ul className="relmap-legend mt-3">
                        <li>
                          <span
                            className="relmap-legend-rail"
                            style={{ backgroundColor: "var(--primary)" }}
                          />
                          Contact
                        </li>
                        <li>
                          <span
                            className="relmap-legend-rail"
                            style={{ backgroundColor: "var(--success)" }}
                          />
                          Deal
                        </li>
                        <li>
                          <span
                            className="relmap-legend-rail"
                            style={{ backgroundColor: "var(--purple)" }}
                          />
                          Account owner
                        </li>
                        <li>
                          <span
                            className="relmap-legend-rail"
                            style={{ backgroundColor: "var(--info)" }}
                          />
                          Project
                        </li>
                        <li>
                          <span
                            className="relmap-legend-rail"
                            style={{ backgroundColor: "var(--warning)" }}
                          />
                          Related company
                        </li>
                        <li className="ms-auto">
                          <span className="rel-strength is-strong">Strong</span>
                        </li>
                        <li>
                          <span className="rel-strength is-good">Good</span>
                        </li>
                        <li>
                          <span className="rel-strength is-neutral">Neutral</span>
                        </li>
                        <li>
                          <span className="rel-strength is-weak">Weak</span>
                        </li>
                        <li>
                          <span className="rel-strength is-risk">At Risk</span>
                        </li>
                      </ul>
                    </div>
                    {/* Hierarchy view */}
                    <div className={view === "hierarchy" ? "" : "d-none"}>
                      <ul className="relmap-tree">
                        <li>
                          <div className="relmap-tree-item">
                            <span className="avatar avatar-sm rounded bg-soft-warning text-warning flex-shrink-0">
                              <i className="ti ti-building-bank" />
                            </span>
                            <div className="flex-grow-1 min-w-0">
                              <Link
                                href={route.companiesDetails}
                                className="fw-medium text-dark d-block"
                              >
                                Halcyon Group Holdings
                              </Link>
                              <span className="fs-12 text-muted">
                                Parent company · 2,400 employees · New York
                              </span>
                            </div>
                            <span className="badge bg-soft-secondary text-secondary">
                              Parent
                            </span>
                          </div>
                          <ul>
                            <li>
                              <div className="relmap-tree-item is-current">
                                <span className="avatar avatar-sm rounded bg-soft-primary text-primary flex-shrink-0">
                                  <i className="ti ti-building" />
                                </span>
                                <div className="flex-grow-1 min-w-0">
                                  <Link
                                    href={route.account360}
                                    className="fw-medium text-dark d-block"
                                  >
                                    Halcyon Partners
                                  </Link>
                                  <span className="fs-12 text-muted">
                                    Current account · 640 employees · Chicago
                                  </span>
                                </div>
                                <span className="badge bg-soft-primary text-primary">
                                  Current
                                </span>
                              </div>
                              <ul>
                                <li>
                                  <div className="relmap-tree-item">
                                    <span className="avatar avatar-sm rounded bg-soft-info text-info flex-shrink-0">
                                      <i className="ti ti-building-store" />
                                    </span>
                                    <div className="flex-grow-1 min-w-0">
                                      <Link
                                        href={route.companiesDetails}
                                        className="fw-medium text-dark d-block"
                                      >
                                        Halcyon Nordics AB
                                      </Link>
                                      <span className="fs-12 text-muted">
                                        Subsidiary · 48 employees · Stockholm
                                      </span>
                                    </div>
                                    <span className="badge bg-soft-info text-info">
                                      Subsidiary
                                    </span>
                                  </div>
                                </li>
                                <li>
                                  <div className="relmap-tree-item">
                                    <span className="avatar avatar-sm rounded bg-soft-info text-info flex-shrink-0">
                                      <i className="ti ti-building-store" />
                                    </span>
                                    <div className="flex-grow-1 min-w-0">
                                      <Link
                                        href={route.companiesDetails}
                                        className="fw-medium text-dark d-block"
                                      >
                                        Halcyon Advisory LLC
                                      </Link>
                                      <span className="fs-12 text-muted">
                                        Subsidiary · 112 employees · Boston
                                      </span>
                                    </div>
                                    <span className="badge bg-soft-info text-info">
                                      Subsidiary
                                    </span>
                                  </div>
                                </li>
                                <li>
                                  <div className="relmap-tree-item">
                                    <span className="avatar avatar-sm rounded bg-soft-secondary text-secondary flex-shrink-0">
                                      <i className="ti ti-map-pin" />
                                    </span>
                                    <div className="flex-grow-1 min-w-0">
                                      <Link
                                        href={route.companiesDetails}
                                        className="fw-medium text-dark d-block"
                                      >
                                        Halcyon Partners — London Branch
                                      </Link>
                                      <span className="fs-12 text-muted">
                                        Branch · 64 employees · London
                                      </span>
                                    </div>
                                    <span className="badge bg-soft-secondary text-secondary">
                                      Branch
                                    </span>
                                  </div>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <div className="relmap-tree-item">
                                <span className="avatar avatar-sm rounded bg-soft-secondary text-secondary flex-shrink-0">
                                  <i className="ti ti-building" />
                                </span>
                                <div className="flex-grow-1 min-w-0">
                                  <Link
                                    href={route.companiesDetails}
                                    className="fw-medium text-dark d-block"
                                  >
                                    Meridian Health
                                  </Link>
                                  <span className="fs-12 text-muted">
                                    Related company · shared board member
                                  </span>
                                </div>
                                <span className="badge bg-soft-secondary text-secondary">
                                  Related
                                </span>
                              </div>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Side rail */}
              <div className="col-xxl-3">
                {/* Contact detail panel */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Relationship Details</h6>
                  </div>
                  <div className="card-body">
                    {!selected ? (
                      <div className="ai-empty py-4">
                        <span className="ai-empty-icon">
                          <i className="ti ti-hand-click" />
                        </span>
                        <h6>Select a node</h6>
                        <p>
                          Choose any node on the map to see the full relationship.
                        </p>
                      </div>
                    ) : selected.kind !== "contact" ? (
                      <>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="ai-insight-icon bg-soft-secondary text-secondary">
                            <i className="ti ti-affiliate" />
                          </span>
                          <div className="min-w-0">
                            <h6 className="mb-0 text-truncate">{selected.name}</h6>
                            <span className="fs-12 text-muted">{selected.title}</span>
                          </div>
                        </div>
                        <p className="fs-13 text-muted">{selected.meta}</p>
                        <span className={`rel-strength ${STRENGTH[selected.strength].cls} mb-3`}>
                          {STRENGTH[selected.strength].label} link to the account
                        </span>
                        <Link
                          href={selected.link ? route[selected.link] : "#"}
                          className="btn btn-outline-light shadow w-100 mt-2"
                        >
                          <i className="ti ti-external-link me-1" />
                          Open record
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="avatar avatar-md rounded bg-soft-primary text-primary flex-shrink-0">
                            <i className="ti ti-user" />
                          </span>
                          <div className="min-w-0">
                            <h6 className="mb-0 text-truncate">{selected.name}</h6>
                            <span className="fs-12 text-muted">{selected.title}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                          <span className="badge bg-soft-primary text-primary">{selected.role}</span>
                          <span className={`rel-strength ${STRENGTH[selected.strength].cls}`}>
                            {STRENGTH[selected.strength].label}
                          </span>
                        </div>
                        <ul className="ai-signals mb-3">
                          <li>
                            <span className="ai-signal-icon bg-soft-secondary text-secondary">
                              <i className="ti ti-building" />
                            </span>
                            <span className="flex-grow-1 fs-12 text-muted">Department</span>
                            <span className="fs-12 fw-medium text-dark text-end">{selected.dept}</span>
                          </li>
                          <li>
                            <span className="ai-signal-icon bg-soft-secondary text-secondary">
                              <i className="ti ti-mail" />
                            </span>
                            <span className="flex-grow-1 fs-12 text-muted">Email</span>
                            <span className="fs-12 fw-medium text-dark text-end">{selected.email}</span>
                          </li>
                          <li>
                            <span className="ai-signal-icon bg-soft-secondary text-secondary">
                              <i className="ti ti-phone" />
                            </span>
                            <span className="flex-grow-1 fs-12 text-muted">Phone</span>
                            <span className="fs-12 fw-medium text-dark text-end">{selected.phone}</span>
                          </li>
                          <li>
                            <span className="ai-signal-icon bg-soft-secondary text-secondary">
                              <i className="ti ti-user-check" />
                            </span>
                            <span className="flex-grow-1 fs-12 text-muted">Sales rep</span>
                            <span className="fs-12 fw-medium text-dark text-end">{selected.owner}</span>
                          </li>
                          <li>
                            <span className="ai-signal-icon bg-soft-secondary text-secondary">
                              <i className="ti ti-clock" />
                            </span>
                            <span className="flex-grow-1 fs-12 text-muted">Last interaction</span>
                            <span className="fs-12 fw-medium text-dark text-end">
                              {selected.last}
                              {(selected.days ?? 0) > 14 && (
                                <span className="badge bg-soft-danger text-danger ms-1">
                                  {selected.days} days
                                </span>
                              )}
                            </span>
                          </li>
                        </ul>
                        <h6 className="fs-13 mb-2">Open deals</h6>
                        {selected.deals && selected.deals.length ? (
                          <ul className="ai-signals mb-3">
                            {selected.deals.map((d) => (
                              <li key={d.name}>
                                <span className="ai-signal-icon bg-soft-success text-success">
                                  <i className="ti ti-briefcase" />
                                </span>
                                <Link href={route.dealsDetails} className="flex-grow-1 fw-medium text-dark">
                                  {d.name}
                                </Link>
                                <span className="ai-signal-weight">{d.value}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="fs-12 text-muted mb-3">No open deals linked to this contact.</p>
                        )}
                        <h6 className="fs-13 mb-2">Recent activities</h6>
                        <ul className="ai-timeline mb-3">
                          {(selected.acts || []).map((a) => (
                            <li className="is-primary" key={a}>
                              <p className="ai-timeline-text mb-0">{a}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="ai-action mb-3">
                          <span className="ai-action-icon bg-soft-primary text-primary">
                            <i className="ti ti-player-track-next" />
                          </span>
                          <div className="flex-grow-1">
                            <h6 className="ai-action-title">Recommended next action</h6>
                            <p className="ai-action-meta">{selected.next}</p>
                          </div>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                          <Link href={route.contactDetails} className="btn btn-primary btn-sm flex-grow-1">
                            <i className="ti ti-user me-1" />
                            Open contact
                          </Link>
                          <Link
                            href={route.aiEmailComposer}
                            className="btn btn-outline-light shadow btn-sm flex-grow-1"
                          >
                            <i className="ti ti-mail me-1" />
                            Email
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Relationship insights */}
                <div className="card mb-0">
                  <div className="card-header d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="ai-chip">
                        <i className="ti ti-sparkles" />
                        AI
                      </span>
                      <h6 className="mb-0">Relationship Insights</h6>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="ai-signals mb-3">
                      <li>
                        <span className="ai-signal-icon bg-soft-success text-success">
                          <i className="ti ti-thumb-up" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="fs-12 text-muted d-block">
                            Strongest relationship
                          </span>
                          <span className="fs-13 fw-medium text-dark">
                            Ellis Vandermeer · CFO
                          </span>
                        </div>
                      </li>
                      <li>
                        <span className="ai-signal-icon bg-soft-danger text-danger">
                          <i className="ti ti-thumb-down" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="fs-12 text-muted d-block">
                            Weakest relationship
                          </span>
                          <span className="fs-13 fw-medium text-dark">
                            Nadia Okonkwo · Group COO
                          </span>
                        </div>
                      </li>
                      <li>
                        <span className="ai-signal-icon bg-soft-primary text-primary">
                          <i className="ti ti-crown" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="fs-12 text-muted d-block">
                            Key decision maker
                          </span>
                          <span className="fs-13 fw-medium text-dark">
                            Ellis Vandermeer · engaged
                          </span>
                        </div>
                      </li>
                      <li>
                        <span className="ai-signal-icon bg-soft-warning text-warning">
                          <i className="ti ti-user-question" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="fs-12 text-muted d-block">
                            Missing stakeholder
                          </span>
                          <span className="fs-13 fw-medium text-dark">
                            No Legal contact mapped
                          </span>
                          <span className="fs-12 text-muted">
                            Contracts stall 2.4x more often without one
                          </span>
                        </div>
                      </li>
                      <li>
                        <span className="ai-signal-icon bg-soft-primary text-primary">
                          <i className="ti ti-clock" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="fs-12 text-muted d-block">
                            Last interaction
                          </span>
                          <span className="fs-13 fw-medium text-dark">
                            6 hours ago · Ellis Vandermeer
                          </span>
                        </div>
                      </li>
                      <li>
                        <span className="ai-signal-icon bg-soft-danger text-danger">
                          <i className="ti ti-calendar-off" />
                        </span>
                        <div className="flex-grow-1">
                          <span className="fs-12 text-muted d-block">
                            Longest silence
                          </span>
                          <span className="fs-13 fw-medium text-dark">
                            34 days · Nadia Okonkwo
                          </span>
                        </div>
                      </li>
                    </ul>
                    <h6 className="fs-13 mb-2">Relationship risk</h6>
                    <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
                      <span className="text-muted">
                        Coverage of the buying committee
                      </span>
                      <span className="fw-medium text-dark">72%</span>
                    </div>
                    <span className="ai-meter is-warning mb-3">
                      <span className="ai-meter-track">
                        <span className="ai-meter-fill" style={{ width: "72%" }} />
                      </span>
                    </span>
                    <p className="fs-12 text-muted">
                      Two of seven stakeholders are weak or at risk, and the
                      executive sponsor has not been contacted in over a month.
                    </p>
                    <div className="ai-action mb-0">
                      <span className="ai-action-icon bg-soft-primary text-primary">
                        <i className="ti ti-player-track-next" />
                      </span>
                      <div className="flex-grow-1">
                        <h6 className="ai-action-title">Recommended action</h6>
                        <p className="ai-action-meta">
                          Ask the champion to re-introduce the executive sponsor
                          before contract stage
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2 mt-3 flex-wrap">
                      <Link
                        href={route.aiEmailComposer}
                        className="btn btn-primary btn-sm flex-grow-1"
                      >
                        <i className="ti ti-mail-star me-1" />
                        Draft intro request
                      </Link>
                      <Link
                        href={route.activities}
                        className="btn btn-outline-light shadow btn-sm flex-grow-1"
                      >
                        <i className="ti ti-checklist me-1" />
                        Log activity
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Content */}
        {/* Start Footer */}
        <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
          <p className="mb-md-0 mb-1">
            Copyright ©
            <Link
              href="#"
              className="link-primary text-decoration-underline"
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
      </div>
      {/* ========================
				End Page Content
			========================= */}
    </>
  )
}

export default RelationshipMapComponent;
