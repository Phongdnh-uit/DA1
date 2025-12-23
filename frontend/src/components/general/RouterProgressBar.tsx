import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import NProgress from "nprogress";

export function RouterProgressBar() {
    const router = useRouter();

    useEffect(() => {
        const unsub = router.subscribe("onBeforeLoad", () => {
            NProgress.start();
        });

        const unsub2 = router.subscribe("onLoad", () => {
            NProgress.done();
        });

        return () => {
            unsub();
            unsub2();
        };
    }, [router]);

    return null;
}
