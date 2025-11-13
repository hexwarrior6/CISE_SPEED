import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import { EvidenceType } from "../types/article";

interface ArticleFormData {
  customId: string;
  title: string;
  authors: string;
  source: string;
  pubyear: string;
  doi: string;
  claim: string;
  evidence: string;
  submitterEmail: string;
}

interface SubmitArticleProps {
  onSubmitSuccess?: (article: ArticleFormData) => void;
}

// Validation schema
const validationSchema = Yup.object().shape({
  customId: Yup.string()
    .optional()
    .matches(
      /^[A-Za-z0-9_\-]+$/,
      "ID can only contain letters, numbers, underscores, and hyphens"
    ),
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters long"),
  authors: Yup.string().required("Authors are required"),
  source: Yup.string().required("Source is required"),
  pubyear: Yup.string()
    .required("Publication year is required")
    .matches(/^\d{4}$/, "Publication year must be 4 digits"),
  doi: Yup.string()
    .required("DOI is required")
    .matches(
      /^10\.\d{4,}(?:\.\d+)*\/[-._;()\/\w]+$/,
      "Please enter a valid DOI"
    ),
  claim: Yup.string()
    .required("Claim is required")
    .min(10, "Claim must be at least 10 characters long"),
  evidence: Yup.string().required("Evidence type is required"),
  submitterEmail: Yup.string()
    .required("Email is required for notification of review results")
    .email("Please enter a valid email address"),
});

const SubmitterForm: React.FC<SubmitArticleProps> = ({ onSubmitSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (values: ArticleFormData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if ID already exists - only if customId is provided
      if (values.customId && values.customId.trim()) {
        const idCheckResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/${values.customId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (idCheckResponse.ok) {
          throw new Error(
            `Article with ID '${values.customId}' already exists. Please choose a different ID.`
          );
        }
      }

      // Prepare the submission payload
      // If customId is empty, don't include it in the request so the backend can auto-generate it
      let submissionValues;
      if (!values.customId?.trim()) {
        // Omit customId if it's empty
        const { customId: _, ...valuesWithoutCustomId } = values;
        submissionValues = valuesWithoutCustomId;
      } else {
        submissionValues = values;
      }

      // Proceed with submission
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(submissionValues),
        }
      );

      if (!response.ok) {
        // Try to get error details from response
        const errorData = await response.json().catch(() => ({}));
        // Use specific error message if available, otherwise generic message
        const errorMessage =
          errorData?.error || errorData?.message || "Failed to submit article";
        // Enhance duplicate ID error message
        if (errorMessage.includes("already exists")) {
          // If the error message contains an empty ID, it means the backend tried to process an empty ID
          // This could happen if the customId field was sent as an empty string
          if (errorMessage.includes("''")) {
            // The backend encountered an error with an empty string ID
            throw new Error(
              "There was an issue with article ID generation. Please try submitting again."
            );
          } else {
            // Use the original logic for non-empty IDs
            throw new Error(
              `Article with ID '${values.customId}' already exists. Please choose a different ID.`
            );
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess(data.message);
      onSubmitSuccess?.(data.article);

      // Reset form after successful submission
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the article"
      );
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Submit SE Evidence Article
      </h1>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Formik
        initialValues={{
          customId: "",
          title: "",
          authors: "",
          source: "",
          pubyear: "",
          doi: "",
          claim: "",
          evidence: "",
          submitterEmail: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<ArticleFormData>) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div style={{ display: "none" }}>
                  <Field id="customId" name="customId" defaultValue="" />
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title *
                  </label>
                  <Field
                    id="title"
                    name="title"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      props.errors.title && props.touched.title
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Title of the article"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="authors"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Authors *
                  </label>
                  <Field
                    id="authors"
                    name="authors"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      props.errors.authors && props.touched.authors
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Author names (comma separated)"
                  />
                  <ErrorMessage
                    name="authors"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="source"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Source *
                  </label>
                  <Field
                    id="source"
                    name="source"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      props.errors.source && props.touched.source
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Journal/Conference name"
                  />
                  <ErrorMessage
                    name="source"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="pubyear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Publication Year *
                  </label>
                  <Field
                    id="pubyear"
                    name="pubyear"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      props.errors.pubyear && props.touched.pubyear
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="YYYY"
                  />
                  <ErrorMessage
                    name="pubyear"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="doi"
                    className="block text-sm font-medium text-gray-700"
                  >
                    DOI *
                  </label>
                  <Field
                    id="doi"
                    name="doi"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      props.errors.doi && props.touched.doi
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="10.xxxx/xxxxx"
                  />
                  <ErrorMessage
                    name="doi"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    DOI will be checked for duplicates
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="evidence"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Evidence Type *
                  </label>
                  <Field
                    as="select"
                    id="evidence"
                    name="evidence"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      props.errors.evidence && props.touched.evidence
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Select evidence type</option>
                    {Object.values(EvidenceType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="evidence"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="submitterEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email for Notifications *
                  </label>
                  <Field
                    id="submitterEmail"
                    name="submitterEmail"
                    type="email"
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      props.errors.submitterEmail &&
                      props.touched.submitterEmail
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="your.email@example.com"
                  />
                  <ErrorMessage
                    name="submitterEmail"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You will receive review results at this email address
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="claim"
                className="block text-sm font-medium text-gray-700"
              >
                Claim *
              </label>
              <Field
                as="textarea"
                id="claim"
                name="claim"
                rows={4}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  props.errors.claim && props.touched.claim
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Describe the SE practice claim made in this article"
              />
              <ErrorMessage
                name="claim"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Article"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SubmitterForm;
