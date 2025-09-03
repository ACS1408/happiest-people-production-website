import React from "react";
import ButtonOutlinedWithIcon from "./ButtonOutlinedWithIcon";
import ButtonLinkWithIcon from "./ButtonLinkWithIcon";
import ButtonFilledWithIcon from "./ButtonFilledWithIcon";

type ButtonProps = {
  href?: string;
  text: string;
  icon: React.ReactNode;
  variant: string;
  as?: React.ElementType;
  className?: string;
  textClass?: string;
  iconClass?: string;
  color?: "black" | "white";
  [key: string]: any;
};

const Button = ({
  href,
  text,
  icon,
  variant,
  as: Component = "a",
  className,
  textClass,
  iconClass,
  color = "black",
  ...props
}: ButtonProps) => {
  switch (variant) {
    case "link-with-icon":
      return (
        <ButtonLinkWithIcon
          href={href}
          text={text}
          icon={icon}
          as={Component}
          className={className}
          textClass={textClass}
          iconClass={iconClass}
          color={color}
          {...props}
        />
      );
    case "outlined-with-icon":
      return (
        <ButtonOutlinedWithIcon
          href={href}
          text={text}
          icon={icon}
          as={Component}
          className={className}
          textClass={textClass}
          iconClass={iconClass}
          color={color}
          {...props}
        />
      );
    case "filled-with-icon":
      return (
        <ButtonFilledWithIcon
          href={href}
          text={text}
          icon={icon}
          as={Component}
          className={className}
          textClass={textClass}
          iconClass={iconClass}
          color={color}
          {...props}
        />
      );
    default:
      return <div>Select a button variant</div>;
  }
};

export default Button;
