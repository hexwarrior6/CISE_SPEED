import { Article } from "@/types/article.types";
import React from "react";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: Article[];
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  customCellClasses?: { [key: string]: string };
}

const SortableTable: React.FC<SortableTableProps> = ({ 
  headers, 
  data, 
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  customCellClasses = {}
}) => {
  // Helper function to get appropriate CSS class for each cell
  const getCellClass = (headerKey: string) => {
    let baseClass = cellClassName || '';
    
    switch(headerKey) {
      case 'title':
        baseClass += (baseClass ? ' ' : '') + (customCellClasses['titleCell'] || '');
        break;
      case 'authors':
        baseClass += (baseClass ? ' ' : '') + (customCellClasses['authorCell'] || '');
        break;
      case 'source':
        baseClass += (baseClass ? ' ' : '') + (customCellClasses['sourceCell'] || '');
        break;
      case 'pubyear':
        baseClass += (baseClass ? ' ' : '') + (customCellClasses['yearCell'] || '');
        break;
      case 'claim':
        baseClass += (baseClass ? ' ' : '') + (customCellClasses['claimCell'] || '');
        break;
      case 'evidence':
        baseClass += (baseClass ? ' ' : '') + (customCellClasses['evidenceCell'] || '');
        break;
      default:
        break;
    }
    
    return baseClass.trim();
  };

  // Helper function to combine class names
  const getClassWithCustom = (headerKey: string, defaultClass: string) => {
    const customClass = getCellClass(headerKey);
    return customClass ? `${defaultClass} ${customClass}` : defaultClass;
  };

  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th 
              key={header.key} 
              className={getClassWithCustom(header.key, headerClassName)}
            >
              <div className={customCellClasses['tableHeader'] || ''}>
                {header.label}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className={rowClassName}>
            {headers.map((header) => (
              <td 
                key={header.key} 
                className={getClassWithCustom(header.key, '')}
                title={String(row[header.key as keyof Article])} // Add title for full text on hover
              >
                {row[header.key as keyof Article]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortableTable;
