import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const JSONView = ({ jsonString }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000); // Clear success message after 2 seconds
  };

  let formattedJson;
  try {
    formattedJson = JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (error) {
    formattedJson = 'Invalid JSON string';
  }

  return (
    <div className="p-4 rounded">
      <pre className="whitespace-pre-wrap p-2 bg-white rounded border border-gray-300 max-h-80 overflow-auto">
        {formattedJson}
      </pre>
      <CopyToClipboard text={formattedJson} onCopy={handleCopy}>
        <button className="btn btn-primary mt-2">Copy to Clipboard</button>
      </CopyToClipboard>
      {copySuccess && <div className="text-green-500 mt-2">{copySuccess}</div>}
    </div>
  );
};

export default JSONView;
