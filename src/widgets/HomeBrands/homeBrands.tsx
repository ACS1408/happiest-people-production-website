import React from 'react'
import Container from '@/components/Container'
import Image from 'next/image'
import { twc } from '@/utils'
import MarqueeSlider from '@/components/MarqueeSlider'

interface BrandLogo {
    name: string;
    src: string;
    width: number;
    height: number;
}

const brandLogos: BrandLogo[] = [
    {
        name: "Virtina",
        src: "/images/virtina.webp",
        width: 165,
        height: 66
    },
    {
        name: "Cartknitter",
        src: "/images/cartknitter.webp",
        width: 192,
        height: 66
    },
    {
        name: "Rainmaker",
        src: "/images/rainmaker.webp",
        width: 192,
        height: 66
    },
    {
        name: "Virtina",
        src: "/images/virtina.webp",
        width: 165,
        height: 66
    },
    {
        name: "Cartknitter",
        src: "/images/cartknitter.webp",
        width: 192,
        height: 66
    },
    {
        name: "Rainmaker",
        src: "/images/rainmaker.webp",
        width: 192,
        height: 66
    }
];

const HomeBrands = () => {
    return (
        <section data-widget="home-brands" className={`home-brands ${twClasses.section}`}>
            <Container>
                <MarqueeSlider className={`home-brands__image-grid ${twClasses.image_grid}`}>
                    {brandLogos.map((brand, index) => (
                        <Image
                            key={`${brand.name}-${index}`}
                            src={brand.src}
                            width={brand.width}
                            height={brand.height}
                            alt={`${brand.name} logo`}
                            className="lg:mx-5 mx-2 h-12 object-contain"
                        />
                    ))}
                </MarqueeSlider>
            </Container>
        </section>
    )
}

export default HomeBrands

const twClasses = twc({
    section: "bg-primary-100 lg:py-6 py-5",
    image_grid: "items-center mix-blend-multiply"
})