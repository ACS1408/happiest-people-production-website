import React from "react";
import Button from "../Button";
import Icons from "@/utils/icons";
import Select from "react-select";
import useCareersApplicationForm from "./useCareersApplicationForm";

const CareersApplicationForm = () => {
  const { formik, phoneInputRef, departmentOptions } =
    useCareersApplicationForm();

  return (
    <div
      data-component="careers-application-form"
      className="careers-application-form"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-8 mt-10">
        {/* Top Row - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name Field */}
          <div className="form-field">
            <div className="floating-label-container">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`floating-input text-white ${
                  formik.errors.firstName && formik.touched.firstName
                    ? "border-red-500"
                    : ""
                }`}
                placeholder=""
              />
              <label htmlFor="firstName" className="floating-label text-gray-300">
                Full name
              </label>
            </div>
            {formik.errors.firstName && formik.touched.firstName && (
              <div className="error-message">{formik.errors.firstName}</div>
            )}
          </div>

          {/* Last Name Field */}
          <div className="form-field">
            <div className="floating-label-container">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`floating-input text-white ${
                  formik.errors.lastName && formik.touched.lastName
                    ? "border-red-500"
                    : ""
                }`}
                placeholder=""
              />
              <label htmlFor="lastName" className="floating-label text-gray-300">
                Last name
              </label>
            </div>
            {formik.errors.lastName && formik.touched.lastName && (
              <div className="error-message">{formik.errors.lastName}</div>
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
                className={`floating-input text-white ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : ""
                }`}
                placeholder=""
              />
              <label htmlFor="email" className="floating-label text-gray-300">
                Email
              </label>
            </div>
            {formik.errors.email && formik.touched.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="form-field">
            <div className="floating-label-container phone-field text-white">
              <input
                ref={phoneInputRef}
                type="tel"
                id="phone"
                name="phone"
                onBlur={() => {
                  formik.setFieldTouched("phone", true);
                  if (phoneInputRef.current) {
                    formik.setFieldValue("phone", phoneInputRef.current.value);
                  }
                }}
                onInput={() => {
                  if (phoneInputRef.current) {
                    formik.setFieldValue("phone", phoneInputRef.current.value);
                  }
                }}
                className={`floating-input text-white !pl-22 ${
                  formik.errors.phone && formik.touched.phone
                    ? "border-red-500"
                    : ""
                }`}
                placeholder=""
              />
              <label htmlFor="phone" className="floating-label text-gray-300">
                Phone number
              </label>
            </div>
            {formik.errors.phone && formik.touched.phone && (
              <div className="error-message">{formik.errors.phone}</div>
            )}
          </div>

          {/* Place Field */}
          <div className="form-field">
            <div className="floating-label-container">
              <input
                type="text"
                id="place"
                name="place"
                value={formik.values.place}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`floating-input text-white ${
                  formik.errors.place && formik.touched.place
                    ? "border-red-500"
                    : ""
                }`}
                placeholder=""
              />
              <label htmlFor="place" className="floating-label text-gray-300">
                Place
              </label>
            </div>
            {formik.errors.place && formik.touched.place && (
              <div className="error-message">{formik.errors.place}</div>
            )}
          </div>

          {/* Departments Field */}
          <div className="form-field">
            <div className="floating-label-container select-field">
              <Select
                instanceId="departments"
                id="departments"
                name="departments"
                value={
                  departmentOptions?.find(
                    (option) => option.value === formik.values.department
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("department", option?.value)
                }
                onBlur={() => formik.setFieldTouched("departments", true)}
                options={departmentOptions?.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                placeholder=""
                styles={customSelectStyles}
                isSearchable={false}
                className={`${
                  formik.errors.department && formik.touched.department
                    ? "border-red-500"
                    : ""
                }`}
              />
              <label htmlFor="department" className="floating-label text-gray-300">
                Department
              </label>
            </div>
            {formik.errors.department && formik.touched.department && (
              <div className="error-message">{formik.errors.department}</div>
            )}
          </div>

          {/* Attach Resume Field */}
          <div className="form-field">
            <div className="file-upload-field relative group">
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  formik.setFieldValue("resume", file);
                }}
                onBlur={formik.handleBlur}
                className={`floating-input text-white file-input hidden`}
              />
              <label
                htmlFor="resume"
                className="file-upload-label flex items-center gap-5 cursor-pointer bg-transparent text-gray-300 text-sm font-normal mt-6 w-max"
              >
                <Icons.PaperClip className="h-8" />
                <span>
                  <span className="text-lg group-hover:text-primary">
                    {formik.values.resume
                      ? formik.values.resume.name
                      : "Add an attachment"}
                  </span>
                  <span className="text-sm text-gray-500 w-max block mt-2">
                    Max. 10 MB. (Type : pdf, doc, png, jpeg, docx)
                  </span>
                </span>
              </label>
            </div>
            {formik.errors.resume && formik.touched.resume && (
              <div className="error-message">{formik.errors.resume}</div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          as="button"
          type="submit"
          text={formik.isSubmitting ? "Submitting..." : "Submit"}
          icon={<Icons.ChevronRight className="h-3 mt-px" />}
          variant="outlined-with-icon"
          color="white"
          className="lg:mt-20 mt-12"
        />
      </form>
    </div>
  );
};

export default CareersApplicationForm;

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
    color: "#fff",
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
