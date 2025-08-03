import React from 'react'
import Link from 'next/link'
import { twc } from '@/utils'

type ButtonOutlinedWithIconProps = {
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

const ButtonOutlinedWithIcon = ({
    href,
    text,
    icon,
    as: Component = 'button',
    className,
    textClass,
    iconClass,
    color = 'black',
    ...props
}: ButtonOutlinedWithIconProps) => {
    const getColorClasses = () => {
        switch (color) {
            case 'white':
                return {
                    border: 'border-white',
                    text: 'text-white group-hover:text-black',
                    icon: 'text-white group-hover:text-black',
                    fill: 'before:bg-white'
                }
            case 'black':
                return {
                    border: 'border-black',
                    text: 'text-black group-hover:text-white',
                    icon: 'text-black group-hover:text-white',
                    fill: 'before:bg-black'
                }
            default:
                return {
                    border: 'border-black',
                    text: 'text-black group-hover:text-white',
                    icon: 'text-black group-hover:text-white',
                    fill: 'before:bg-black'
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

    const buttonClassName = `btn btn-outlined-with-icon ${twClasses.button} ${colorClasses.border} ${colorClasses.fill} ${className || ''}`.trim()

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

export default ButtonOutlinedWithIcon

const twClasses = twc({
    button: 'border px-10 py-4 flex justify-center items-center gap-2 group min-w-52 relative overflow-hidden transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-black/10 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 hover:before:scale-x-100 will-change-transform',
    button_text: 'transition-all duration-300 ease-out relative z-10 will-change-transform',
    button_icon: '-mt-0.5 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110 relative z-10 will-change-transform'
})