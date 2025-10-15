"use client";

interface Props {
  title: string;
}

export default function ShareButton({ title }: Props) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
    >
      Share
    </button>
  );
}
