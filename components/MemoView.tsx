"use client";

import ReactMarkdown from "react-markdown";

interface MemoViewProps {
  memo: string;
}

export default function MemoView({ memo }: MemoViewProps) {
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #9333ea, #7c3aed)" }} />
        <h2 className="text-base font-semibold text-gray-900">Investment Memo</h2>
      </div>
      <div className="max-w-none text-gray-800">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-semibold text-gray-900 mt-7 mb-2 pb-2 border-b border-gray-100">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-1">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-1.5 mb-3 pl-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1.5 mb-3 text-sm text-gray-600">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-sm text-gray-600 flex gap-2">
                <span className="text-purple-400 flex-shrink-0 mt-0.5">•</span>
                <span>{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-purple-200 pl-4 italic text-gray-500 my-4">{children}</blockquote>
            ),
            hr: () => <hr className="border-gray-100 my-6" />,
          }}
        >
          {memo}
        </ReactMarkdown>
      </div>
    </div>
  );
}
