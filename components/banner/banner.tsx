import Image from "next/image";
import BannerImage from "@/assets/images/banner-photo.jpg";
import classes from "./banner.module.scss";



interface bannerOption {
    title: string;
}

export default function Banner({ title }: bannerOption) {
    return (
        <>
            <div className={`${classes.banner} relative`}>
                <canvas width="1600" height="550" className="block w-full bg-primary-accent"></canvas>
                <Image src={BannerImage} className="block w-full h-full object-cover object-left-center absolute top-0 left-0" alt="Banner" />
                <div className="absolute z-50 w-full h-full flex items-center justify-center top-0 left-0">
                    <h2 className="text-7xl font-semibold pb-9 max-sm:text-3xl">
                        {title ? title : ''}
                    </h2>
                </div>
             
            </div>
        </>
    )
}