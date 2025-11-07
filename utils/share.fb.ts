export const shareOnFacebook = (url: string) => {
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  window.open(
    fbShareUrl,
    "_blank",
    "width=600,height=400,scrollbars=yes,resizable=yes"
  );
};
