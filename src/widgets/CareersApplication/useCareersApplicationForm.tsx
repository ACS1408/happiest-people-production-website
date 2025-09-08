import { useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import type {
  FormData,
  DepartmentOption,
} from "@/types/careersApplicationForm";

const useCareersApplicationForm = () => {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const intlTelInputRef = useRef<any>(null);

  const departmentOptions: DepartmentOption[] = [
    { value: "", label: "Select department" },
    { value: "web-development", label: "Web Development" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "ui-ux-design", label: "UI/UX Design" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "consulting", label: "Consulting" },
  ];

  const initialValues: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    place: "",
    department: departmentOptions[0].value,
    resume: null,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "First Name must be at least 2 characters")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(2, "Last Name must be at least 2 characters")
      .required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .test(
        "custom-phone-validation",
        "Invalid phone number",
        function (value) {
          if (!value) return false;
          // Only digits allowed
          if (!/^\d+$/.test(value)) return false;
          // Check minimum length (e.g., 10 digits)
          if (value.length < 10) return false;
          return true;
        }
      ),
    place: Yup.string()
      .min(2, "Place must be at least 2 characters")
      .required("Place is required"),
    department: Yup.string().test(
      "department",
      "Please select a department",
      (value) => {
        return !!value && value !== "";
      }
    ),
    resume: Yup.mixed()
      .required("Resume is required")
      .test(
        "fileSize",
        "File too large (max 10MB)",
        value => !value || (value instanceof File && value.size <= 10 * 1024 * 1024)
      )
      .test(
        "fileType",
        "Unsupported file type",
        value =>
          !value ||
          (value instanceof File && [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/png",
            "image/jpeg"
          ].includes(value.type))
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const formattedPhoneNumber = `${
        intlTelInputRef.current?.getSelectedCountryData()?.dialCodePlus
      }-${values.phone}`;
      const selectedDepartment = departmentOptions?.find(
        (option) => option.value === values.department
      )?.label;

      // Payload to be sent to the server or API
      const formData = {
        ...values,
        phone: formattedPhoneNumber,
        department: selectedDepartment,
      };
      console.log("Form submitted:", formData);

      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        resetForm();
        // Reset the phone input and phone value
        if (intlTelInputRef.current) {
          intlTelInputRef.current.setCountry("in");
        }
        if (phoneInputRef.current) {
          phoneInputRef.current.value = "";
        }
        // You can add success message here
      }, 1000);
    },
  });

  useEffect(() => {
    let observer: MutationObserver | undefined;

    // Mutation observer for phone country list
    if (phoneInputRef.current) {
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

    // Mutation observer for react-select dropdown menu
    const selectObserver = new MutationObserver(() => {
      const selectMenu = document.querySelector(
        "#react-select-department-listbox"
      );
      if (selectMenu && !selectMenu.hasAttribute("data-lenis-prevent")) {
        selectMenu.setAttribute("data-lenis-prevent", "");
      }
    });
    selectObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (intlTelInputRef.current) {
        intlTelInputRef.current.destroy();
      }
      if (observer) observer.disconnect();
      selectObserver.disconnect();
    };
  }, []);
  return { formik, phoneInputRef, departmentOptions };
};

export default useCareersApplicationForm;
