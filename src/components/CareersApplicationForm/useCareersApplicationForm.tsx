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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const dialCode = intlTelInputRef.current?.getSelectedCountryData()?.dialCodePlus || "";
        const formattedPhoneNumber = `${dialCode} ${values.phone}`.trim();
        const selectedDepartment = departmentOptions?.find(
          (option) => option.value === values.department
        )?.label;

        // 1. Upload resume if present
        let resumeUrl = "";
        if (values.resume) {
          const fd = new FormData();
          // Upload API expects field name 'file'
          fd.append("file", values.resume);
          // Provide meta fields so backend can incorporate them into key naming
          fd.append("firstName", values.firstName);
          fd.append("lastName", values.lastName);
          fd.append("department", values.department); // raw value; backend can slug
          const uploadRes = await fetch("/api/uploads", {
            method: "POST",
            body: fd,
          });
          const uploadJson = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadJson.error || "Upload failed");
          resumeUrl = uploadJson.url;
        } else {
          throw new Error("Resume missing");
        }

        // 2. Persist application
        const res = await fetch("/api/careers/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            phone: formattedPhoneNumber,
            department: selectedDepartment,
            resume: resumeUrl,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Submission failed");
        console.log("Application submitted");
        resetForm();
        if (intlTelInputRef.current) {
          intlTelInputRef.current.setCountry("in");
        }
        if (phoneInputRef.current) {
          phoneInputRef.current.value = "";
        }
      } catch (e: any) {
        console.log("Career application submit error", e.message);
      } finally {
        setSubmitting(false);
      }
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
