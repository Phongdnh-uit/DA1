import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePropertyComparisonStore } from "@/stores/propertyComparisonStore";
import { useNavigate } from "@tanstack/react-router";

export const FloatingCompareBar = () => {
    const navigate = useNavigate();
    const selectedProperties = usePropertyComparisonStore(
        (s) => s.selectedProperties,
    );
    const reset = usePropertyComparisonStore((s) => s.reset);

    const canCompare = selectedProperties.length === 2;

    const compareClickHandler = () => {
        navigate({
            to: `/compare/${selectedProperties[0]}/to/${selectedProperties[1]}`,
        });
        reset();
    };

    return (
        <AnimatePresence>
            {selectedProperties.length > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <motion.div
                        className="bg-white border-2 border-primary shadow-2xl rounded-full px-8 py-4 flex items-center gap-6"
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.div
                            key={selectedProperties.length}
                            initial={{ scale: 1.5, color: "#3b82f6" }}
                            animate={{ scale: 1, color: "#000000" }}
                            className="text-lg font-semibold whitespace-nowrap"
                        >
                            Bạn đã chọn {selectedProperties.length}/2 bất động sản.{" "}
                            {!canCompare && "Chọn thêm 1 để so sánh."}
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => reset()}
                                className="rounded-full hover:bg-red-50 hover:text-red-600"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Hủy
                            </Button>

                            <motion.div
                                initial={false}
                                animate={{
                                    scale: canCompare ? [1, 1.1, 1] : 1,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <Button
                                    onClick={compareClickHandler}
                                    disabled={!canCompare}
                                    className="rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="sm"
                                >
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    So sánh
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
