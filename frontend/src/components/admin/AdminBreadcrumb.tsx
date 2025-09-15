import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "@tanstack/react-router";
import { ChevronsRight } from "lucide-react";
import React, { useEffect, useState } from "react";

interface AdminBreadcrumbProps {
    className?: string;
}

export const AdminBreadcrumb = (props: AdminBreadcrumbProps) => {
    const router = useRouter();
    const path = router.state.location.pathname;
    const [list, setList] = useState<string[]>([]);

    const page = list ? list[list.length - 1] : "Breadcrumb";
    const links = list ? list.slice(0, -1) : ["Home", "Components"];
    const paths = links.reduce<string[]>((acc, curr) => {
        if (acc.length === 0) {
            acc.push(`/${curr.toLowerCase()}`);
        } else {
            acc.push(`${acc[acc.length - 1]}/${curr.toLowerCase()}`);
        }
        return acc;
    }, []);
    useEffect(() => {
        console.log(path.split("/").filter((p) => p));
        setList(path.split("/").filter((p) => p));
    }, [path]);
    return (
        <Breadcrumb className={props.className}>
            <BreadcrumbList>
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={paths[index]}>
                                <Badge
                                    variant="outline"
                                    className="font-medium shadow-none rounded-full capitalize"
                                >
                                    {link}
                                </Badge>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronsRight />
                        </BreadcrumbSeparator>
                    </React.Fragment>
                ))}
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        <Badge className="shadow-none rounded-full capitalize">
                            {page}
                        </Badge>
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
};
