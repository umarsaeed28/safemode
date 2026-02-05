const mdComponents = {
  h2: (props) => (
    <h2 className="mt-10 mb-4 text-xl font-semibold tracking-tight text-gray-900" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-3 text-lg font-semibold text-gray-900" {...props} />
  ),
  p: (props) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
  ul: (props) => <ul className="mb-4 list-disc pl-6 space-y-1 text-gray-700" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal pl-6 space-y-1 text-gray-700" {...props} />,
  a: (props) => (
    <a className="text-[var(--md-sys-color-primary)] underline underline-offset-2 hover:no-underline" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="border-l-4 border-[var(--md-sys-color-primary)] pl-4 my-4 italic text-gray-600" {...props} />
  ),
  code: (props) => (
    <code className="px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono" {...props} />
  ),
  pre: (props) => (
    <pre className="p-4 overflow-x-auto rounded-lg bg-gray-900 text-gray-100 text-sm my-4" {...props} />
  ),
};

export { mdComponents };
