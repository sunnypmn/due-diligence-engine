"use client";

import ReactMarkdown from "react-markdown";

interface MemoViewProps {
  memo: string;
}

export default function MemoView({ memo }: MemoViewProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Investment Memo
      </h2>
      <div className="prose prose-sm max-w-none text-gray-800">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold text-gray-900 mt-6 mb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold text-gray-900 mt-5 mb-2 border-b border-gray-100 pb-1">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold text-gray-800 mt-4 mb-1">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-gray-700">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-gray-700">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-sm text-gray-700">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600 my-3">
                {children}
              </blockquote>
            ),
          }}
        >
          {memo}
        </ReactMarkdown>
      </div>
    </div>
  );
}
