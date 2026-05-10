import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useSettings();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSound}
      aria-label={soundEnabled ? "Desativar som" : "Ativar som"}
    >
      {soundEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
}
