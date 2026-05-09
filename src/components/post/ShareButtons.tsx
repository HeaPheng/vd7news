import CopyLinkButton from "./CopyLinkButton";

type ShareButtonsProps = {
  title: string;
  url: string;
};

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.099 4.388 23.094 10.125 24v-8.438H7.078v-3.49h3.047V9.41c0-3.022 1.792-4.692 4.533-4.692 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.955.93-1.955 1.885v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.099 24 12.073Z"
      />
      <path
        fill="#fff"
        d="M16.671 15.562l.532-3.49h-3.328V9.81c0-.955.466-1.885 1.955-1.885h1.514v-2.97s-1.373-.237-2.686-.237c-2.74 0-4.533 1.67-4.533 4.692v2.662H7.078v3.49h3.047V24a12.15 12.15 0 0 0 3.75 0v-8.438h2.796Z"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#27A7E7" />
      <path
        fill="#fff"
        d="M17.53 7.84 6.93 11.93c-.72.29-.72.69-.13.87l2.72.85 1.05 3.3c.13.36.06.5.45.5.3 0 .43-.14.6-.3l1.47-1.43 3.05 2.25c.56.31.97.15 1.11-.52l1.8-8.5c.2-.82-.3-1.2-.97-.96Zm-1.38 2.02-4.83 4.36-.19 2.03-.08-.08-1-3.14 6.1-3.85c.26-.16.5.07.3.24Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#000" />
      <path
        fill="#fff"
        d="M14.08 10.17 19.75 4h-1.34l-4.92 5.36L9.56 4H5l5.94 8.65L5 20h1.34l5.2-5.66L15.44 20H20l-5.92-9.83Zm-1.86 2.02-.6-.86L6.85 4.5h2.08l3.85 5.5.6.86 5 7.14H16.3l-4.08-5.8Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        fill="#25D366"
        d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.16 1.59 5.98L0 24l6.29-1.65a11.83 11.83 0 0 0 5.77 1.48h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.45-8.45Z"
      />
      <path
        fill="#fff"
        d="M12.08 21.82h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.83 9.83 0 0 1-1.52-5.3c0-5.44 4.43-9.87 9.89-9.87 2.64 0 5.12 1.03 6.98 2.89a9.8 9.8 0 0 1 2.9 6.98c0 5.45-4.44 9.89-9.88 9.89Z"
      />
      <path
        fill="#25D366"
        d="M17.5 14.48c-.3-.15-1.76-.86-2.03-.96-.27-.1-.46-.15-.66.15-.2.3-.76.96-.94 1.16-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.41-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.66-1.6-.9-2.2-.24-.57-.49-.5-.66-.5h-.56c-.2 0-.53.08-.8.38-.27.3-1.04 1.01-1.04 2.47 0 1.45 1.06 2.85 1.2 3.05.15.2 2.08 3.18 5.04 4.47.7.3 1.25.49 1.68.63.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

function WeChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <circle cx="9" cy="10" r="6.5" fill="#7BD549" />
      <circle cx="16.5" cy="14.5" r="5.5" fill="#51C332" />
      <path
        fill="#7BD549"
        d="M4.8 15.4 4 19l3.1-1.7-.6-1.9 2.3-.8-4-.9Z"
      />
      <path
        fill="#51C332"
        d="M18.4 18.7 19 22l-2.8-1.4.3-1.5-1.7-.4 3.6-.5Z"
      />
      <circle cx="6.9" cy="9.5" r="0.9" fill="#fff" />
      <circle cx="10.9" cy="9.5" r="0.9" fill="#fff" />
      <circle cx="14.7" cy="13.8" r="0.8" fill="#fff" />
      <circle cx="17.8" cy="13.8" r="0.8" fill="#fff" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#06C755" />
      <path
        fill="#fff"
        d="M19.28 10.8c0-3.08-3.08-5.58-6.87-5.58s-6.87 2.5-6.87 5.58c0 2.76 2.44 5.07 5.73 5.5.22.05.52.16.6.37.07.19.05.49.03.68l-.1.61c-.03.18-.13.72.63.39.76-.33 4.09-2.41 5.58-4.13h-.01c1.03-1.13 1.28-2.28 1.28-3.42Z"
      />
      <path
        fill="#06C755"
        d="M9.2 9.1H8.4c-.12 0-.22.1-.22.22v3.76c0 .12.1.22.22.22h.8c.12 0 .22-.1.22-.22v-1.03h1.08c.12 0 .22-.1.22-.22v-.67c0-.12-.1-.22-.22-.22H9.42v-.61c0-.12-.1-.22-.22-.22Zm2.62 0h-.8c-.12 0-.22.1-.22.22v3.76c0 .12.1.22.22.22h.8c.12 0 .22-.1.22-.22V9.32c0-.12-.1-.22-.22-.22Zm3.64 0h-.8c-.12 0-.22.1-.22.22v2.24l-1.72-2.36a.23.23 0 0 0-.18-.1h-.8c-.12 0-.22.1-.22.22v3.76c0 .12.1.22.22.22h.8c.12 0 .22-.1.22-.22v-2.24l1.72 2.36c.04.06.11.1.18.1h.8c.12 0 .22-.1.22-.22V9.32c0-.12-.1-.22-.22-.22Z"
      />
    </svg>
  );
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const telegram = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const x = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const wechat = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
  const line = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;

  return (
    <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 max-sm:items-center">
      <span className="text-sm font-medium text-slate-700 max-sm:text-center dark:text-slate-200">
        ចែករំលែកទៅកាន់:
      </span>

      <div className="flex flex-wrap items-center gap-1.5 max-sm:justify-center">
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn inline-flex items-center justify-center"
          aria-label="Share on Facebook"
        >
          <FacebookIcon />
        </a>

        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn inline-flex items-center justify-center"
          aria-label="Share on Telegram"
        >
          <TelegramIcon />
        </a>

        <a
          href={x}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn inline-flex items-center justify-center"
          aria-label="Share on X"
        >
          <XIcon />
        </a>

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn inline-flex items-center justify-center"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon />
        </a>

        <a
          href={wechat}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn inline-flex items-center justify-center"
          aria-label="Share on WeChat"
        >
          <WeChatIcon />
        </a>

        <a
          href={line}
          target="_blank"
          rel="noopener noreferrer"
          className="share-btn inline-flex items-center justify-center"
          aria-label="Share on Line"
        >
          <LineIcon />
        </a>

        <CopyLinkButton url={url} />
      </div>
    </div>
  );
}