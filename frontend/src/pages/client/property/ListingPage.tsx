import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListIcon, MapIcon } from "lucide-react";
import SearchMap from "./component/SearchMap";
import { ListingView } from "./component/ListingView";

export const ListingPage = () => {
    return (
        <section className="py-20 px-4">
            <div className="max-w-[85rem] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                        Tất cả bất động sản
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Khám phá danh sách đầy đủ các bất động sản hiện có của chúng tôi.
                        Tìm kiếm ngôi nhà mơ ước của bạn ngay hôm nay!
                    </p>
                </div>
                <div className="mb-4">
                    <Tabs defaultValue="nomal">
                        <div className="flex justify-end mb-4">
                            <TabsList>
                                <TabsTrigger value={"nomal"}>
                                    <ListIcon className="h-7 w-7" />
                                    Danh sách
                                </TabsTrigger>
                                <TabsTrigger value={"map"}>
                                    <MapIcon className="h-7 w-7" />
                                    Bản đồ
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value={"nomal"}>
                            <ListingView />
                        </TabsContent>
                        <TabsContent value={"map"}>
                            <SearchMap />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    );
};
