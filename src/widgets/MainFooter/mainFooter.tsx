import React from 'react';
import Container from '@/components/Container';
import Image from 'next/image';

import Facebook from "@/icons/facebook.svg";
import Linkedin from "@/icons/linkedin.svg";
import Instagram from "@/icons/instagram.svg";
import Behance from "@/icons/behance.svg";
import Link from 'next/link';

// Icon map to match `name` in socials
const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Facebook,
    Linkedin,
    Instagram,
    Behance,
};

const socials = [
    {
        id: "facebook_01",
        name: "Facebook",
        url: "https://www.facebook.com",
    },
    {
        id: "linkedin_02",
        name: "Linkedin",
        url: "https://www.linkedin.com",
    },
    {
        id: "instagram_03",
        name: "Instagram",
        url: "https://www.instagram.com",
    },
    {
        id: "behance_04",
        name: "Behance",
        url: "https://www.behance.com",
    },
];

const navLinks = [
    { id: "home_01", name: "Home", url: "/" },
    { id: "services_02", name: "Services", url: "/services" },
    { id: "about_us_03", name: "About Us", url: "/about-us" },
    { id: "features_04", name: "Features", url: "/features" },
    { id: "testimonials_05", name: "Testimonials", url: "/testimonials" },
    { id: "solutions_06", name: "Solutions", url: "/solutions" },
    { id: "industry_vertical_07", name: "Industry Vertical", url: "/industry-vertical" },
    { id: "products_08", name: "Products", url: "/products" },
    { id: "blogs_09", name: "Blogs", url: "/blogs" },
    { id: "key_features_10", name: "Key Features", url: "/key-features" },
];


const MainFooter = () => {
    return (
        <footer className="main-footer pt-32 pb-10">
            <Container>
                <div className="grid grid-cols-2 gap-5">
                    <figure>
                        <Image
                            src="/images/hpp-logo-with-text.svg"
                            alt="happy people productions logo in black"
                            width={267}
                            height={195}
                        />
                    </figure>
                    <nav className="grid grid-cols-2 gap-x-10 gap-y-3 ps-[20%]">
                        {navLinks?.map(item => (
                            <Link href={item?.url} key={item?.id} className='transition-colors duration-300 ease-in-out hover:text-primary'>{item?.name}</Link>
                        ))}
                    </nav>
                </div>

                <div className="flex justify-between gap-3 pt-20 flex-wrap">
                    <div className="email">
                        <div className='text-grey-light text-sm font-medium'>Email</div>
                        <a href="mailto:easyhydromechanical@gmail.com" className='font-semibold transition-colors duration-300 ease-in-out hover:text-primary'>
                            easyhydromechanical@gmail.com
                        </a>
                    </div>

                    <nav className="flex gap-3">
                        {socials?.map(({ id, name, url }) => {
                            const SocialIcon = iconMap[name];
                            return (
                                SocialIcon && (
                                    <a
                                        key={id}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="border border-grey rounded-full size-12 flex justify-center items-center"
                                        aria-label={name}
                                    >
                                        <SocialIcon />
                                    </a>
                                )
                            );
                        })}
                    </nav>
                </div>
            </Container>
        </footer>
    );
};

export default MainFooter;
