// pages/articles/new.tsx (或你当前 NewDiscussion 组件的路径)

import { FormEvent, useState } from "react";
import formStyles from "../../styles/Form.module.scss";
import { CreateArticleDto } from "../../types/article.types";

const NewDiscussion = () => {
  // 根据后端 CreateArticleDto 定义状态
  const [customId, setCustomId] = useState("");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState(""); // 改为字符串，不是数组
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState(""); // 改为字符串，与后端一致
  const [doi, setDoi] = useState("");
  const [claim, setClaim] = useState(""); // 新增 claim 字段
  const [evidence, setEvidence] = useState(""); // 新增 evidence 字段

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
        <label htmlFor="customId">Custom ID:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="customId"
          id="customId"
          value={customId}
          onChange={(event) => setCustomId(event.target.value)}
          required
        />

        <label htmlFor="title">Title:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="authors">Authors (comma-separated):</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="authors"
          id="authors"
          value={authors}
          onChange={(event) => setAuthors(event.target.value)}
          placeholder="e.g., Siniaalto, M., Abrahamsson, P."
          required
        />

        <label htmlFor="source">Source:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="source"
          id="source"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          required
        />

        <label htmlFor="pubYear">Publication Year:</label>
        <input
          className={formStyles.formItem}
          type="text" // 使用 text 类型，因为后端是 string
          name="pubYear"
          id="pubYear"
          value={pubYear}
          onChange={(event) => setPubYear(event.target.value)}
          required
        />

        <label htmlFor="doi">DOI:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="doi"
          id="doi"
          value={doi}
          onChange={(event) => setDoi(event.target.value)}
          required
        />

        <label htmlFor="claim">Claim:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="claim"
          id="claim"
          value={claim}
          onChange={(event) => setClaim(event.target.value)}
          required
        />

        <label htmlFor="evidence">Evidence:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="evidence"
          id="evidence"
          value={evidence}
          onChange={(event) => setEvidence(event.target.value)}
          required
        />

        <button className={formStyles.formItem} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewDiscussion;