"use client";

type ScrollButtonsProps = {
  showCallButton?: boolean;
};

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 16.92V19.92C22 20.47 21.79 21 21.41 21.38C21.03 21.76 20.5 21.98 19.95 21.98C16.41 21.76 13 20.54 10.12 18.47C7.45 16.59 5.41 14.55 3.53 11.88C1.45 8.99 0.24 5.56 0.02 2.01C0.01 1.46 0.22 0.93 0.6 0.55C0.98 0.17 1.51 -0.04 2.06 0H5.06C6.04 0 6.88 0.71 7.05 1.67C7.18 2.44 7.39 3.2 7.67 3.93C7.97 4.73 7.78 5.63 7.18 6.24L5.91 7.51C7.33 10.16 9.84 12.67 12.49 14.09L13.76 12.82C14.37 12.22 15.27 12.03 16.07 12.33C16.8 12.61 17.56 12.82 18.33 12.95C19.3 13.12 20 13.96 20 14.94V16.92H22Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 19V5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M6 11L12 5L18 11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ScrollButtons({
  showCallButton = false,
}: ScrollButtonsProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="floating-actions">
      {showCallButton && (
        <a
          href="tel:016697766"
          className="floating-btn floating-btn-call"
          aria-label="Call 016697766"
          title="Call 016697766"
        >
          <span className="floating-btn-icon">
            <PhoneIcon />
          </span>
        </a>
      )}

      <button
        type="button"
        onClick={handleScrollTop}
        className="floating-btn floating-btn-top"
        aria-label="Scroll to top"
        title="Back to top"
      >
        <span className="floating-btn-icon">
          <ArrowUpIcon />
        </span>
      </button>
    </div>
  );
}