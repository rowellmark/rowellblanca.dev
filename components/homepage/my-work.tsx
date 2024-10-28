import { Tab } from "../ui/tabs";


interface props {
    notitle: string;
}


const projects_tab: string[] = ["All", "Wordpress", "ReactJS", "NextJS", "Shopify", "Firebase"];


export function MyWork({ notitle }: props ) {
    return (
        <div className="bg-primary-accent">
            <div className="container mx-auto w-full px-8 max-lg:max-w-full pt-10 ">
                {notitle ? '' : (
                    <h2 className="text-white relative z-20 font-bold text-7xl text-center w-full pb-10">
                        <span className="block text-text-accent font-medium text-lg uppercase">My</span>
                        Work
                    </h2>
                )}
                <Tab nav={projects_tab}/>
            </div>
        </div>
    );
}