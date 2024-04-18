import { Tab } from "../ui/tabs";
import projects from "@/json/projects.json";

export function MyWork() {
    

    return (
        <div className="container mx-auto w-full">
            <h2 className="text-white relative z-20 font-bold text-7xl text-center w-full pb-6">
                <span className="block text-text-accent font-medium text-lg uppercase">My</span>
                Work
            </h2>
            <Tab tabs={projects} />
        </div>
    );
}
