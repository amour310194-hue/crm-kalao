import { Suspense } from "react";
import ProjectsListComponent from "@/components/Pages/crm-module/projects/projectsList";

export const metadata = {
  title: "Project List",
};

export default function ProjectList(){
    return(
        <Suspense fallback={null}><ProjectsListComponent/></Suspense>
    )
}