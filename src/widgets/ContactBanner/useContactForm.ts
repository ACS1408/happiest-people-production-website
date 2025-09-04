import { useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { type FormData, type ServiceOption } from "@/types/contactForm";

const useContactForm = () => {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const intlTelInputRef = useRef<any>(null);

  const serviceOptions: ServiceOption[] = [
    { value: "", label: "Please Select" },
    { value: "web-development", label: "Web Development" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "ui-ux-design", label: "UI/UX Design" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "consulting", label: "Consulting" },
  ];

  const initialValues: FormData = {
    fullName: "",
    email: "",
    phone: "",
    services: serviceOptions[0],
    message: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .test("phone", "Invalid phone number", function (value) {
        if (!value) return false;
        if (intlTelInputRef.current) {
          return intlTelInputRef.current.isValidNumber();
        }
        return true;
      }),
    services: Yup.object().nullable().required("Please select a service"),
    message: Yup.string()
      .min(10, "Message must be at least 10 characters")
      .required("Message is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      // Handle form submission here
      console.log("Form submitted:", values);

      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        resetForm();
        // Reset the phone input
        if (intlTelInputRef.current) {
          intlTelInputRef.current.setCountry("in");
        }
        // You can add success message here
      }, 1000);
    },
  });

  useEffect(() => {
    let observer: MutationObserver;

    if (phoneInputRef.current) {
      // Create a mutation observer to watch for the country list
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const countryList = document.querySelector(".iti__country-list");
            if (
              countryList &&
              !countryList.hasAttribute("data-lenis-prevent")
            ) {
              countryList.setAttribute("data-lenis-prevent", "");
            }
          }
        });
      });

      // Start observing the body for the dropdown
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      intlTelInputRef.current = intlTelInput(phoneInputRef.current, {
        initialCountry: "in",
        separateDialCode: true,
        formatOnDisplay: false,
        allowDropdown: true,
        autoPlaceholder: "aggressive",
        nationalMode: true,
      });

      // Add data-lenis-prevent to country list dropdown
      const countryList = document.querySelector(".iti__country-list");
      if (countryList) {
        countryList.setAttribute("data-lenis-prevent", "");
      }

      const handleInput = () => {
        if (intlTelInputRef.current && phoneInputRef.current) {
          const number = intlTelInputRef.current.getNumber();
          formik.setFieldValue("phone", number);
        }
      };

      phoneInputRef.current.addEventListener("input", handleInput);
      phoneInputRef.current.addEventListener("countrychange", handleInput);
    }

    return () => {
      if (intlTelInputRef.current) {
        intlTelInputRef.current.destroy();
      }
      observer.disconnect();
    };
  }, []);
  return { formik, phoneInputRef, serviceOptions };
};

export default useContactForm;
