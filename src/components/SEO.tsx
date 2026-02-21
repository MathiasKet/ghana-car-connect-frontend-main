import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
}

const SEO = ({
    title,
    description,
    keywords,
    ogImage,
    ogType = 'website',
    canonicalUrl
}: SEOProps) => {
    const siteName = 'CarConnect Ghana';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDesc = 'CarConnect Ghana - The premier automotive marketplace for buying, selling, and renting cars in Ghana.';
    const defaultKeywords = 'buy cars ghana, sell cars ghana, car rentals ghana, used cars accra, toyota camry ghana';

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Update Meta Tags
        const updateMetaTag = (name: string, content: string, attr: string = 'name') => {
            let tag = document.querySelector(`meta[${attr}="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attr, name);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        updateMetaTag('description', description || defaultDesc);
        updateMetaTag('keywords', keywords || defaultKeywords);

        // Open Graph
        updateMetaTag('og:title', fullTitle, 'property');
        updateMetaTag('og:description', description || defaultDesc, 'property');
        updateMetaTag('og:type', ogType, 'property');
        if (ogImage) updateMetaTag('og:image', ogImage, 'property');

        // Twitter
        updateMetaTag('twitter:title', fullTitle);
        updateMetaTag('twitter:description', description || defaultDesc);
        if (ogImage) updateMetaTag('twitter:image', ogImage);

        // Canonical Link
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', canonicalUrl || window.location.href);

    }, [fullTitle, description, keywords, ogImage, ogType, canonicalUrl]);

    return null; // This component doesn't render anything
};

export default SEO;
