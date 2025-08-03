import React from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'
import ChevronRight from "@/icons/chevron-right.svg"
import { twc } from '@/utils'

const HomeClients = () => {
    return (
        <section data-widget="home-clients" className={`home-clients ${twClasses.section}`}>
            <Container>
                <div className="flex items-center">
                    <h2 className={`home-clients__title ${twClasses.title}`}>Our <em className='font-medium'>Clients</em></h2>
                    <p className={`home-clients__description ${twClasses.description}`}>We value our clients as partners and are committed to delivering exceptional results tailored to their unique goals.</p>
                </div>
                <div className="flex justify-center mt-32">
                    <Button
                        text="View All"
                        icon={<ChevronRight />}
                        variant="outlined-with-icon"
                        href="/all-works"
                        color="black"
                    />
                </div>
            </Container>
        </section>
    )
}

export default HomeClients

const twClasses = twc({
    section: "2xl:py-48 py-32",
    title: "ff-figtree fs-title-secondary font-light flex-[0_0_600px] max-w-[600px]",
    description: "fs-para-secondary max-w-[638px] ms-auto"
})