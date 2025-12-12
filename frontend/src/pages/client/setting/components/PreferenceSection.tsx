"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/hooks/use-dark-mode";
import {
    ThemeToggleButton,
    useThemeTransition,
} from "@/components/ui/shadcn-io/theme-toggle-button";

export function PreferencesSection() {
    const { toggle, isDarkMode } = useDarkMode();

    const { startTransition } = useThemeTransition();

    const themes = [
        {
            id: "light",
            label: "Sáng",
            description: "Giao diện sáng, rõ ràng và hiện đại",
        },
        {
            id: "dark",
            label: "Tối",
            description: "Thoải mái cho mắt khi làm việc lâu",
        },
    ];

    return (
        <Card id="preferences" className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Tuỳ chỉnh</h2>

            <div className="space-y-8">
                <div>
                    <h3 className="text-sm font-medium text-foreground mb-4">
                        Giao diện
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {themes.map((t) => {
                            const isActive =
                                (t.id === "dark" && isDarkMode) ||
                                (t.id === "light" && !isDarkMode);
                            return (
                                <ThemeToggleButton
                                    variant="circle-blur"
                                    onClick={() => startTransition(toggle)}
                                    asChild
                                >
                                    <motion.button
                                        key={t.id}
                                        layout
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "relative p-4 rounded-lg border-2 text-left transition-colors cursor-pointer",
                                            isActive
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50",
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{t.label}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {t.description}
                                                </p>
                                            </div>
                                            {isActive && (
                                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                            )}
                                        </div>
                                    </motion.button>
                                </ThemeToggleButton>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
}
