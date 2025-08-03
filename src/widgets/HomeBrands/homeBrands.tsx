import React from 'react'
import Container from '@/components/Container'
import Image from 'next/image'
import { twc } from '@/utils'

const HomeBrands = () => {
    return (
        <section data-widget="home-brands" className={`home-brands ${twClasses.section}`}>
            <Container>
                <div className={`home-brands__image-grid ${twClasses.image_grid}`}>
                    <Image src="/images/virtina.png" width={165} height={66} alt="virtina logo" />
                    <Image src="/images/cartknitter.png" width={192} height={66} alt="cartknitter logo" />
                    <Image src="/images/rainmaker.png" width={192} height={66} alt="rainmaker logo" />
                    <Image src="/images/cartknitter.png" width={192} height={66} alt="cartknitter logo" />
                    <Image src="/images/rainmaker.png" width={192} height={66} alt="rainmaker logo" />
                </div>
            </Container>
        </section>
    )
}

export default HomeBrands

const twClasses = twc({
    section: "bg-tertiary py-9",
    image_grid: "flex justify-center items-center gap-[6%] mix-blend-multiply"
})