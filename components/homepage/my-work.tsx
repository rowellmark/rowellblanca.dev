import { Tab } from "../ui/tabs";
import projects from "@/json/projects.json";

export function MyWork() {
    

    return (
        <div className="container mx-auto w-full">
            <Tab tabs={projects} />
        </div>
    );
}
