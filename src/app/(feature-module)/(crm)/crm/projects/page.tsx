import { Suspense } from "react";
import ProjectsGridComponent from "@/components/Pages/crm-module/projects/projectsGrid";

export const metadata = {
  title: "Project",
};

export default function Projects(){
    return(
        <Suspense fallback={null}><ProjectsGridComponent/></Suspense>
    )
}