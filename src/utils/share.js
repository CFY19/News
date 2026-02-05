/**
 * Handles sharing logic using Web Share API or Clipboard fallback
 */
export const handleShare = async (item) => {
  const shareData = {
    title: item.title,
    text: item.description,
    url: item.sourceUrl || window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return { success: false, method: 'native' };
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareData.url);
      return { success: true, method: 'clipboard' };
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      return { success: false, method: 'clipboard' };
    }
  }
};
