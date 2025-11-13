import { CreateArticleDto } from "@/types/article.types";
import { useAuth } from "@/contexts/AuthContext";
import { FormEvent, useState } from "react";
import formStyles from "../styles/Form.module.scss";

interface FormData {
  title: string;
  authors: string;
  source: string;
  pubYear: string;
  doi: string;
  claim: string;
  evidence: string;
}

export default function SubmissionForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    authors: "",
    source: "",
    pubYear: "",
    doi: "",
    claim: "",
    evidence: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const articleData: CreateArticleDto = {
      customId: "", // assuming this is handled elsewhere or removed
      title: formData.title,
      authors: formData.authors,
      source: formData.source,
      pubyear: formData.pubYear,
      doi: formData.doi,
      claim: formData.claim,
      evidence: formData.evidence,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        alert('Article submitted successfully!');
        // Reset form
        setFormData({
          title: "",
          authors: "",
          source: "",
          pubYear: "",
          doi: "",
          claim: "",
          evidence: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={formStyles.form}>
      <h2 className="text-center mb-lg">Submit New Article</h2>
      <form onSubmit={onSubmit}>
        <div className={formStyles.formGroup}>
          <label htmlFor="title" className={formStyles.formLabel}>
            Title:
          </label>
          <input
            className={formStyles.formControl}
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="authors" className={formStyles.formLabel}>
            Authors:
          </label>
          <input
            className={formStyles.formControl}
            type="text"
            name="authors"
            id="authors"
            value={formData.authors}
            onChange={handleChange}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="source" className={formStyles.formLabel}>
            Source:
          </label>
          <input
            className={formStyles.formControl}
            type="text"
            name="source"
            id="source"
            value={formData.source}
            onChange={handleChange}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="pubYear" className={formStyles.formLabel}>
            Publication Year:
          </label>
          <input
            className={formStyles.formControl}
            type="number"
            name="pubYear"
            id="pubYear"
            value={formData.pubYear}
            onChange={handleChange}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="doi" className={formStyles.formLabel}>
            DOI:
          </label>
          <input
            className={formStyles.formControl}
            type="text"
            name="doi"
            id="doi"
            value={formData.doi}
            onChange={handleChange}
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="claim" className={formStyles.formLabel}>
            Claim:
          </label>
          <input
            className={formStyles.formControl}
            type="text"
            name="claim"
            id="claim"
            value={formData.claim}
            onChange={handleChange}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="evidence" className={formStyles.formLabel}>
            Evidence:
          </label>
          <textarea
            className={`${formStyles.formControl} ${formStyles.formTextArea}`}
            name="evidence"
            id="evidence"
            value={formData.evidence}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button 
          className={`${formStyles.btnPrimary} ${formStyles.formGroup}`} 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
}
