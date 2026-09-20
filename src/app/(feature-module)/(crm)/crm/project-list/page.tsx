import { Suspense } from "react";
import ProjectsListComponent from "@/components/Pages/crm-module/projects/projectsList";

export const metadata = {
  title: "Project List | CRMS - Advanced Bootstrap 5 Admin Template for Customer Management",
};

export default function ProjectList(){
    return(
        <Suspense fallback={null}><ProjectsListComponent/></Suspense>
    )
}