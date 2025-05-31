import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";

type Props = {
  copyText: string;
  buttonText?: string;
};

function CopyButton({ copyText, buttonText }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => clearTimeout(id);
  }, [isCopied]);

  function handleFallbackCopy(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
      },
      (err) => {
        console.error("Fallback: Oops, unable to copy", err);
      },
    );
  }
  function handleCopyClick() {
    if (!copyText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(copyText)
        .then(() => setIsCopied(true))
        .catch((err) => console.log(err));
    } else {
      handleFallbackCopy(copyText);
    }
  }
  return (
    <Button
      aria-label={isCopied ? "Copied!" : "copy"}
      aria-live="assertive"
      title={isCopied ? "Copied!" : "click to copy address"}
      onPress={handleCopyClick}
      variant="faded"
      className="flex items-center gap-2 text-sm"
    >
      <span>{buttonText}</span>
      <span aria-hidden className="rounded-full size-6 p-1 ">
        {isCopied ? <CheckIcon /> : <DocumentDuplicateIcon />}
      </span>
    </Button>
  );
}

export default CopyButton;
