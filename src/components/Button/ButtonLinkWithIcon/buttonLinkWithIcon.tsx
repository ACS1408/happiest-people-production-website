import React from 'react'
import Link from 'next/link'
import { twc } from '@/utils'

type ButtonLinkWithIconProps = {
    href?: string
    text: string
    icon: React.ReactNode
    as?: React.ElementType
    className?: string
    textClass?: string
    iconClass?: string
    color?: 'black' | 'white'
    [key: string]: any
}
const ButtonLinkWithIcon = ({
    href,
    text,
    icon,
    as: Component = 'button',
    className,
    textClass,
    iconClass,
    color = 'black',
    ...props
}: ButtonLinkWithIconProps) => {
    const getColorClasses = () => {
        switch (color) {
            case 'white':
                return {
                    text: 'text-white group-hover:text-primary',
                    icon: 'text-white group-hover:text-primary'
                }
            case 'black':
                return {
                    text: 'text-black group-hover:text-primary',
                    icon: 'text-black group-hover:text-primary'
                }
            default:
                return {
                    text: 'text-black group-hover:text-primary',
                    icon: 'text-black group-hover:text-primary'
                }
        }
    }

    const colorClasses = getColorClasses()

    const content = (
        <>
            <span className={`btn-text ${twClasses.button_text} ${colorClasses.text} ${textClass || ''}`}>{text}</span>
            <span className={`btn-icon ${twClasses.button_icon} ${colorClasses.icon} ${iconClass || ''}`}>{icon}</span>
        </>
    )

    const buttonClassName = `btn btn-link-with-icon ${twClasses.button} ${className || ''}`.trim()

    if (!!Component) {
        if (Component === 'a' && href) {
            return (
                <Component href={href} className={buttonClassName} {...props}>
                    {content}
                </Component>
            )
        } else {
            return (
                <Component className={buttonClassName} {...props}>
                    {content}
                </Component>
            )
        }
    }

    return (
        <Link href={href || '#'} className={buttonClassName} {...props}>
            {content}
        </Link>
    )
}

export default ButtonLinkWithIcon

const twClasses = twc({
    button: 'flex items-center gap-2 group relative transition-all duration-300 ease-out cursor-pointer hover:scale-105 will-change-transform',
    button_text: 'transition-all duration-300 ease-out',
    button_icon: '-mt-0.5 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110 will-change-transform'
})