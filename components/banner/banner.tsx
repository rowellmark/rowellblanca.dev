import Image from "next/image";
import BannerImage from "@/assets/images/banner-photo.jpg";
import classes from "./banner.module.scss";

import BannerImageNew from "@/assets/images/banner-photo-new.jpg";


interface bannerOption {
    title: string;
    subtitle: string;
}

export default function Banner({ title, subtitle }: bannerOption) {
    return (
        <>
            <div className={`${classes.banner} relative`}>
                <canvas width="1600" height="550" className="block w-full bg-primary-accent"></canvas>
                <Image src={BannerImageNew} className="block w-full h-full object-cover object-left-center absolute top-0 left-0" alt="Banner" />
                <div className="absolute z-50 w-full h-full flex items-center justify-center top-0 left-0">
                    <h2 className="text-white relative z-20 font-bold text-7xl text-center w-full pb-10">
                        <span className="block text-accent-color-slate font-medium text-lg uppercase">{subtitle ? subtitle : ''}</span>
                        {title ? title : ''}
                    </h2>
                </div>
             
            </div>
        </>
    )
}