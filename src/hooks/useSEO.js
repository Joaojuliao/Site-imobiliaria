import { useEffect } from 'react';

const useSEO = (title, description) => {
    useEffect(() => {
        // Update Title
        const prevTitle = document.title;
        if (title) {
            document.title = `${title} | ImobiSheet`;
        }

        // Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        const prevDescription = metaDescription ? metaDescription.getAttribute('content') : '';

        if (description && metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // Cleanup (optional, but good for SPAs if you want to restore defaults)
        return () => {
            document.title = prevTitle;
            if (metaDescription && prevDescription) {
                metaDescription.setAttribute('content', prevDescription);
            }
        };
    }, [title, description]);
};

export default useSEO;
