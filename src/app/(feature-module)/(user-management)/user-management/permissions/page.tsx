import { Suspense } from "react";
import PermissionComponent from "@/components/Pages/user-management/permission/permission";

export const metadata = {
  title: "Accès par module",
};

export default function Permission() {
  return (
    <Suspense>
      <PermissionComponent />
    </Suspense>
  );
}
