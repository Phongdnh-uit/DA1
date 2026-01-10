import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouterState } from "@tanstack/react-router";
import { SlashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface AdminBreadcrumbProps {
  className?: string;
}

export const AdminBreadcrumb = (props: AdminBreadcrumbProps) => {
  const path = useRouterState({ select: (state) => state.location.pathname });
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
                  variant={"secondary"}
                  className="font-medium text-sm shadow-none rounded-full capitalize text-zinc-500 hover:text-zinc-700"
                >
                  {link}
                </Badge>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Badge
              variant={"secondary"}
              className="shadow-none font-medium text-sm rounded-full capitalize"
            >
              {page}
            </Badge>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
