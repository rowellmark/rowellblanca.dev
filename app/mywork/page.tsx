import { MyWork } from "@/components/homepage/my-work";

import Link from "next/link";

import {
    IconArrowLeft
} from "@tabler/icons-react";
import Banner from "@/components/banner/banner";

export default function MyWorkPage() {
    return (
        <>
            <Banner title="Work" subtitle="my" />
            <div className="py-7">
                <div className="container mx-auto">
                    <div className="back-button flex items-start pb-6 max-lg:px-5">
                        <div className="back-button flex items-start pb-6 max-lg:px-0">
                            <Link href="/" className="flex items-center px-4 py-2 uppercase font-semibold rounded-mdtext-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
                                <IconArrowLeft className="mr-3" /> Back
                            </Link>
                        </div>
                    </div>
                    <MyWork notitle="true"/>
                </div>
               
            </div>
        </>
    )
} 

