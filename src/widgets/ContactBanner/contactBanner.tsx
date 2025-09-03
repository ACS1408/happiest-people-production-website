import React, { useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import intlTelInput from "intl-tel-input";
import Select from "react-select";
import Container from "@/components/Container";
import { twc } from "@/utils";
import Button from "@/components/Button";
import ChevronRight from "@/icons/chevron-right.svg";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  services: { value: string; label: string } | null;
  message: string;
}

interface ServiceOption {
  value: string;
  label: string;
}

const ContactBanner = () => {
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
            const countryList = document.querySelector('.iti__country-list');
            if (countryList && !countryList.hasAttribute('data-lenis-prevent')) {
              countryList.setAttribute('data-lenis-prevent', '');
            }
          }
        });
      });

      // Start observing the body for the dropdown
      observer.observe(document.body, {
        childList: true,
        subtree: true
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
      const countryList = document.querySelector('.iti__country-list');
      if (countryList) {
        countryList.setAttribute('data-lenis-prevent', '');
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

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      borderBottom: state.isFocused ? "2px solid #292929" : "2px solid #7e8695",
      borderRadius: 0,
      boxShadow: "none",
      paddingTop: "16px",
      paddingBottom: "16px",
      height: "57.6px",
      "&:hover": {
        borderBottom: "2px solid #7e8695",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#7e8695",
      fontSize: "14px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      fontSize: "16px",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#171717",
      fontSize: "14px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      border: "1px solid #7e8695",
      borderRadius: "6px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      marginTop: "4px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#fbcf1dae !important" : "white",
      color: state.isSelected ? "#000 !important" : "#535353",
      fontSize: "14px",
      padding: "8px 12px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f9fafb",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#7e8695",
      padding: "0 8px 0 0",
    }),
  };

  return (
    <section
      data-widget="contact-banner"
      className={`contact-banner ${twClasses.section}`}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Title */}
          <div className="">
            <figure>
              <svg
                width="475"
                height="474"
                viewBox="0 0 475 474"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  opacity="0.58"
                  cx="237.419"
                  cy="237.069"
                  r="236.507"
                  fill="url(#paint0_linear_1097_33155)"
                  stroke="url(#paint1_linear_1097_33155)"
                  strokeWidth="0.617404"
                />
                <path
                  d="M113.191 437.87L158.553 289.9"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M183.703 467.072L209.64 285.459L216.048 472.685"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M263.078 288.561L286.698 468.212"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M156.746 290.009C156.106 258.929 180.783 233.216 211.863 232.577C242.942 231.937 268.656 256.614 269.295 287.694L269.34 289.885L156.791 292.201L156.746 290.009Z"
                  fill="#FCD124"
                />
                <path
                  d="M216.732 157.75C232.13 157.75 244.35 172.352 244.35 190.015C244.35 207.677 232.13 222.279 216.732 222.279C201.335 222.279 189.115 207.677 189.115 190.015C189.115 172.352 201.335 157.75 216.732 157.75Z"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M211.379 178.005C209.917 192.866 200.01 205.008 195.239 209.222C181.665 187.513 195.239 169.022 198.388 165.967C217.584 148.423 234.525 165.215 237.418 169.022C225.693 178.919 213.816 177.396 211.379 178.005Z"
                  fill="black"
                  stroke="black"
                />
                <path
                  d="M191.305 127.436C202.465 134.679 205.252 153.879 205.292 164.074C205.296 165.081 204.791 166.008 203.969 166.588C202.898 167.345 201.473 167.348 200.329 166.707C186.034 158.709 178.077 170.571 175.641 175C173.864 178.231 173.669 183.607 173.712 188.444C173.746 192.242 173.356 196.064 172.098 199.648C161.552 229.713 139.807 227.671 135.002 228.107C112.262 228.999 100.499 205.997 97.8452 200.254C97.6757 199.887 97.5415 199.496 97.4435 199.105C86.4698 155.265 107.074 143.335 113.697 138.271C125.046 129.575 140.725 135.089 148.692 138.508C151.6 139.755 154.503 138.59 156.172 135.901C168.381 116.245 185.823 124.941 190.252 126.888C190.618 127.049 190.969 127.218 191.305 127.436Z"
                  fill="black"
                  stroke="black"
                />
                <path
                  d="M310.268 123.763C315.834 118.258 330.542 111.104 344.848 126.527C344.568 121.776 351.274 104.453 372.229 117.026"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M439.233 109.09C446.243 109.09 452.474 113.275 456.909 119.808C461.348 126.346 464.061 135.322 464.061 145.188C464.061 155.053 461.348 164.029 456.909 170.567C452.474 177.1 446.243 181.285 439.233 181.285C432.224 181.285 425.992 177.1 421.558 170.567C417.119 164.029 414.406 155.053 414.406 145.188C414.406 135.322 417.119 126.346 421.558 119.808C425.992 113.275 432.224 109.09 439.233 109.09Z"
                  fill="#FEF6D4"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M434.15 109.762L372.229 134.394L376.534 181.101H441.627"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M327.994 191.863C331.139 208.544 344.577 241.448 373.172 239.617C377.462 239.616 399.751 235.473 404.185 211.319C407.042 195.754 407.573 184.689 407.481 181.102"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M381.521 114.297C381.589 114.294 381.759 114.288 381.948 114.347C382.048 114.378 382.225 114.447 382.387 114.611C382.549 114.776 382.651 114.991 382.676 115.222L382.682 115.322L382.76 118.448C383.098 131.121 384.426 177.939 384.635 185.304C384.667 186.455 383.744 187.305 382.678 187.328L226.906 190.697L226.578 190.704L226.309 190.515C224.826 189.47 222.972 187.372 222.142 184.708C221.29 181.976 221.534 178.69 224.231 175.473L224.394 175.279L224.627 175.187L224.998 176.115C224.636 175.209 224.628 175.187 224.629 175.186C224.63 175.185 224.632 175.185 224.635 175.184C224.64 175.182 224.647 175.179 224.656 175.175C224.675 175.167 224.704 175.156 224.741 175.141C224.817 175.111 224.929 175.066 225.077 175.007C225.374 174.889 225.813 174.713 226.387 174.484C227.534 174.027 229.217 173.355 231.359 172.502C235.644 170.795 241.764 168.359 249.108 165.441C263.797 159.606 283.382 151.843 302.968 144.135C322.553 136.427 342.141 128.773 356.836 123.155C364.182 120.347 370.31 118.045 374.605 116.499C376.751 115.727 378.451 115.14 379.619 114.771C380.198 114.589 380.671 114.452 381.011 114.376C381.17 114.34 381.353 114.305 381.521 114.297Z"
                  fill="#FEF9E1"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M383.146 114.295C390.295 114.295 396.655 118.525 401.186 125.138C405.719 131.755 408.49 140.842 408.49 150.83C408.49 160.818 405.719 169.905 401.186 176.522C396.655 183.135 390.295 187.365 383.146 187.365C375.998 187.365 369.638 183.135 365.107 176.522C360.574 169.905 357.803 160.818 357.803 150.83C357.803 140.842 360.574 131.755 365.107 125.138C369.638 118.525 375.998 114.295 383.146 114.295Z"
                  fill="#FEF9E1"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M252.172 167.32C260.974 139.247 275.118 133.897 281.09 134.73C291.188 122.389 297.256 124.163 308.432 124.861C328.269 118.155 334.835 126.397 336.931 129.331C330.602 132.358 328.672 134.66 324.086 140.13L323.871 140.386C318.371 147.404 317.802 168.269 315.525 197.859C313.249 227.45 304.145 235.796 300.161 238.641C276.451 253.816 260.897 237.882 255.397 232.95C243.257 220.242 250.465 176.994 252.172 167.32Z"
                  fill="#FEF9E1"
                />
                <path
                  d="M270.983 176.393C270.599 155.704 277.974 116.877 306.666 124.837"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M288.584 174.701C288.301 161.789 291.733 133.756 307.731 124.92C310.207 123.587 328.166 116.794 336.93 129.154C328.616 134.547 322.029 136.274 318.849 155.488C316.376 175.804 316.788 216.661 306.048 232.335C299.3 241.222 280.376 254.517 258.66 236.602C253.571 232.335 244.79 224.748 248.004 193.189C248.881 174.701 256.072 134.428 280.012 134.428"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1097_33155"
                    x1="255.834"
                    y1="-508.65"
                    x2="216.767"
                    y2="404.971"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#F2C200" />
                    <stop offset="1" stopColor="#FCD228" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_1097_33155"
                    x1="237.419"
                    y1="0.253906"
                    x2="237.419"
                    y2="473.885"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#DBB32D" />
                    <stop offset="1" stopColor="#FCD32E" />
                  </linearGradient>
                </defs>
              </svg>
            </figure>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white">
            <h2 className={`contact-banner__title ${twClasses.title}`}>
              Contact <em className="font-medium">us</em>
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-8 mt-10">
              {/* Top Row - Two Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Field */}
                <div className="form-field">
                  <div className="floating-label-container">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`floating-input ${
                        formik.errors.fullName && formik.touched.fullName
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder=" "
                    />
                    <label htmlFor="fullName" className="floating-label">
                      Full name
                    </label>
                  </div>
                  {formik.errors.fullName && formik.touched.fullName && (
                    <div className="error-message">
                      {formik.errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="form-field">
                  <div className="floating-label-container">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`floating-input ${
                        formik.errors.email && formik.touched.email
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder=" "
                    />
                    <label htmlFor="email" className="floating-label">
                      Email
                    </label>
                  </div>
                  {formik.errors.email && formik.touched.email && (
                    <div className="error-message">{formik.errors.email}</div>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="form-field">
                  <div className="floating-label-container phone-field">
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      id="phone"
                      name="phone"
                      onBlur={() => formik.setFieldTouched("phone", true)}
                      className={`floating-input !pl-22 ${
                        formik.errors.phone && formik.touched.phone
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder=" "
                    />
                    <label htmlFor="phone" className="floating-label">
                      Phone number
                    </label>
                  </div>
                  {formik.errors.phone && formik.touched.phone && (
                    <div className="error-message">{formik.errors.phone}</div>
                  )}
                </div>

                {/* Services Field */}
                <div className="form-field">
                  <div className="floating-label-container select-field">
                    <Select
                      instanceId="services-select"
                      id="services"
                      name="services"
                      value={formik.values.services}
                      onChange={(option) =>
                        formik.setFieldValue("services", option)
                      }
                      onBlur={() => formik.setFieldTouched("services", true)}
                      options={serviceOptions}
                      placeholder=""
                      styles={customSelectStyles}
                      isSearchable={false}
                      className={`${
                        formik.errors.services && formik.touched.services
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <label htmlFor="services" className="floating-label">
                      Services
                    </label>
                  </div>
                  {formik.errors.services && formik.touched.services && (
                    <div className="error-message">
                      {formik.errors.services}
                    </div>
                  )}
                </div>

                {/* Message Field - Single Column */}
                <div className="form-field col-span-2">
                  <div className="floating-label-container">
                    <textarea
                      id="message"
                      name="message"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`floating-input min-h-[80px] resize-none ${
                        formik.errors.message && formik.touched.message
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder=" "
                    />
                    <label htmlFor="message" className="floating-label">
                      Message
                    </label>
                  </div>
                  {formik.errors.message && formik.touched.message && (
                    <div className="error-message">{formik.errors.message}</div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                as="button"
                type="submit"
                text={formik.isSubmitting ? "Submitting..." : "Submit"}
                icon={<ChevronRight className="h-3 mt-px" />}
                variant="filled-with-icon"
                color="black"
                className="mt-16"
              />
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactBanner;

const twClasses = twc({
  section: "pt-12 pb-32 bg-white mt-[122.6px]",
  title: "text-4xl leading-tight",
});
