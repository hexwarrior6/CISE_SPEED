import { Article } from "@/types/article.types";
import React from "react";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: Article[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => (
  <table>
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header.key}>{header.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>
          {headers.map((header) => (
            <td key={header.key}>{row[header.key as keyof Article]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default SortableTable;
