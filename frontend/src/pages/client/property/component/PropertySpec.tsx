"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animation";

export interface SpecItemProps {
    icon: React.ElementType;
    title: string;
    value: string;
}

interface ProductSpecsProps {
    specs: SpecItemProps[];
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specs }) => {
    if (!specs || specs.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp.container}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Đặc điểm bất động sản
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div
                        className="grid grid-cols-2 gap-x-4 gap-y-6"
                        variants={fadeInUp.item}
                        initial="hidden"
                        animate="show"
                    >
                        {specs.map((spec, index) => {
                            const IconComponent = spec.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-3"
                                    variants={fadeInUp.item}
                                >
                                    <div className="flex-shrink-0 bg-muted p-2 rounded-md">
                                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-base text-muted-foreground">
                                            {spec.title}
                                        </p>
                                        <p className="font-medium text-lg">{spec.value}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
