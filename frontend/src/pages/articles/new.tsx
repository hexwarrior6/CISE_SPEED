// pages/articles/new.tsx (or your current NewDiscussion component's path)

import { FormEvent, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import formStyles from "../../styles/Form.module.scss";
import { CreateArticleDto } from "@/types/article.types";

const NewDiscussion = () => {
  // Define all hooks first before any conditional returns
  const [customId, setCustomId] = useState("");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState(""); // 改为字符串，不是数组
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState(""); // 改为字符串，与后端一致
  const [doi, setDoi] = useState("");
  const [claim, setClaim] = useState(""); // 新增 claim 字段
  const [evidence, setEvidence] = useState(""); // 新增 evidence 字段
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  // Check if user is authenticated and redirect if not
  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.push('/login');
    return <div>Redirecting to login...</div>;
  }

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newArticle: CreateArticleDto = {
      customId,
      title,
      authors,
      source,
      pubyear: pubYear, // 注意字段名是 pubyear
      doi,
      claim,
      evidence,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(newArticle),
      });

      if (response.ok) {
        alert('Article submitted successfully!');
        // 清空表单
        setCustomId("");
        setTitle("");
        setAuthors("");
        setSource("");
        setPubYear("");
        setDoi("");
        setClaim("");
        setEvidence("");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>New Article</h1>
      <form className={formStyles.form} onSubmit={submitNewArticle}>
        <div className={formStyles.formGroup}>
          <label htmlFor="customId" className={formStyles.formLabel}>Custom ID:</label>
          <input
            className={formStyles.formControl}
            type="text"
            name="customId"
            id="customId"
            value={customId}
            onChange={(event) => setCustomId(event.target.value)}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="title" className={formStyles.formLabel}>Title:</label>
          <input
            className={formStyles.formControl}
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="authors" className={formStyles.formLabel}>Authors (comma-separated):</label>
          <input
            className={formStyles.formControl}
            type="text"
            name="authors"
            id="authors"
            value={authors}
            onChange={(event) => setAuthors(event.target.value)}
            placeholder="e.g., Siniaalto, M., Abrahamsson, P."
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="source" className={formStyles.formLabel}>Source:</label>
          <input
            className={formStyles.formControl}
            type="text"
            name="source"
            id="source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="pubYear" className={formStyles.formLabel}>Publication Year:</label>
          <input
            className={formStyles.formControl}
            type="text" // 使用 text 类型，因为后端是 string
            name="pubYear"
            id="pubYear"
            value={pubYear}
            onChange={(event) => setPubYear(event.target.value)}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="doi" className={formStyles.formLabel}>DOI:</label>
          <input
            className={formStyles.formControl}
            type="text"
            name="doi"
            id="doi"
            value={doi}
            onChange={(event) => setDoi(event.target.value)}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="claim" className={formStyles.formLabel}>Claim:</label>
          <input
            className={formStyles.formControl}
            type="text"
            name="claim"
            id="claim"
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="evidence" className={formStyles.formLabel}>Evidence:</label>
          <input
            className={formStyles.formControl}
            type="text"
            name="evidence"
            id="evidence"
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
            required
          />
        </div>

        <button className={formStyles.btnPrimary} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;