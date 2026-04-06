'use client';

// Renders simple markdown: ## headings, **bold**, - bullets, numbered lists, paragraphs
export function FormattedText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className={className}>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) return <div key={i} className="h-2" />;

        // Heading ### (check first — more specific)
        if (trimmed.startsWith('### ')) {
          return <h4 key={i} className="text-base font-bold text-gray-800 mt-4 mb-1">{renderInline(trimmed.slice(4))}</h4>;
        }

        // Heading ##
        if (trimmed.startsWith('## ')) {
          return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{renderInline(trimmed.slice(3))}</h3>;
        }

        // Bullet -
        if (trimmed.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 ml-4 mb-1">
              <span className="text-primary-600 mt-1">•</span>
              <p className="text-gray-600">{renderInline(trimmed.slice(2))}</p>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 ml-4 mb-1">
              <span className="text-primary-600 font-medium">{numMatch[1]}.</span>
              <p className="text-gray-600">{renderInline(numMatch[2])}</p>
            </div>
          );
        }

        // Regular paragraph
        return <p key={i} className="text-gray-600 leading-relaxed mb-3">{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

// Render inline **bold**
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-gray-900 font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
