import React, { useEffect } from 'react';

export default function SEOHead({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Alo Yoga India`;
    }
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
}
