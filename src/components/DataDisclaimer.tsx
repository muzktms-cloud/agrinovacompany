import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataDisclaimerProps {
  sources: string[];
  verifyLinks?: { label: string; url: string }[];
}

const DataDisclaimer = ({ sources, verifyLinks }: DataDisclaimerProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
      <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
      <div>
        <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">
          {t("disclaimer.title", "Data Sources & Accuracy")}
        </p>
        <p>
          {t("disclaimer.weather", "Weather data: Open-Meteo (real-time).")} {" "}
          {t("disclaimer.advisory", "Advisory content uses AI analysis based on:")} {sources.join(", ")}.
        </p>
        {verifyLinks && verifyLinks.length > 0 && (
          <p className="mt-1">
            {t("disclaimer.verify", "Verify prices at:")}{" "}
            {verifyLinks.map((link, i) => (
              <span key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                  {link.label}
                </a>
                {i < verifyLinks.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
};

export default DataDisclaimer;
