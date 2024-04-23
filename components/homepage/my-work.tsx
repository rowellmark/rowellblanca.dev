import { Tab } from "../ui/tabs";
import projects from "@/json/projects.json";


interface props {
    notitle: string;
}

export function MyWork({ notitle }: props ) {
    return (
        <div className="container mx-auto w-full px-8 max-lg:max-w-full">
            {notitle ? '' : (
                <h2 className="text-white relative z-20 font-bold text-7xl text-center w-full pb-10">
                    <span className="block text-text-accent font-medium text-lg uppercase">My</span>
                    Work
                </h2>
            )}
            <Tab tabs={projects} />
        </div>
    );
}
