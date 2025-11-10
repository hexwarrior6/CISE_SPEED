import { Article, CreateArticleDto } from "@/types/article.types";
import { useAuth } from "@/contexts/AuthContext";
import { FormEvent, useState } from "react";

export default function SubmissionForm() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [source, setSource] = useState("");
  const [pubyear, setPubyear] = useState("");
  const [doi, setDoi] = useState("");
  const [claim, setClaim] = useState("");
  const [evidence, setEvidence] = useState("");
  const [customId, setCustomId] = useState("");
  const { token } = useAuth();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const articleData: CreateArticleDto = {
      customId,
      title,
      authors,
      source,
      pubyear,
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
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        alert('Article submitted successfully!');
        // Reset form
        setTitle("");
        setAuthors("");
        setSource("");
        setPubyear("");
        setDoi("");
        setClaim("");
        setEvidence("");
        setCustomId("");
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <p>
        <input 
          value={customId} 
          onChange={(e) => setCustomId(e.target.value)} 
          placeholder="Custom ID" 
          required
        />
      </p>
      <p>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Title" 
          required
        />
      </p>
      <p>
        <input 
          value={authors} 
          onChange={(e) => setAuthors(e.target.value)} 
          placeholder="Authors" 
          required
        />
      </p>
      <p>
        <input 
          value={source} 
          onChange={(e) => setSource(e.target.value)} 
          placeholder="Source" 
          required
        />
      </p>
      <p>
        <input 
          value={pubyear} 
          onChange={(e) => setPubyear(e.target.value)} 
          placeholder="Publication Year" 
          required
        />
      </p>
      <p>
        <input 
          value={doi} 
          onChange={(e) => setDoi(e.target.value)} 
          placeholder="DOI" 
          required
        />
      </p>
      <p>
        <input 
          value={claim} 
          onChange={(e) => setClaim(e.target.value)} 
          placeholder="Claim" 
          required
        />
      </p>
      <p>
        <input 
          value={evidence} 
          onChange={(e) => setEvidence(e.target.value)} 
          placeholder="Evidence" 
          required
        />
      </p>

      <select>
        <option value="">Select SE practice...</option>
        <option value="TDD">TDD</option>
        <option value="Mob Programming">Mob Programming</option>
      </select>
      <input type="submit" value="Submit Article" />
    </form>
  );
}
