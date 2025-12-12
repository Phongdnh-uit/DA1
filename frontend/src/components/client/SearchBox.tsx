"use client";
import { useState, type FormEvent } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const tabs = [
    { id: 38, label: "Nhà đất bán" },
    { id: 49, label: "Nhà đất cho thuê" },
    { id: 351, label: "Dự án" },
];

const categories = [
    "Tất cả nhà đất",
    "Căn hộ chung cư",
    "Nhà riêng",
    "Đất nền dự án",
    "Shophouse",
];

const priceRanges = [
    "Tất cả khoảng giá",
    "Dưới 500 triệu",
    "500 - 800 triệu",
    "800 triệu - 1 tỷ",
    "1 - 2 tỷ",
    "2 - 3 tỷ",
    "3 - 5 tỷ",
    "Trên 5 tỷ",
];

const areas = [
    "Tất cả diện tích",
    "Dưới 30 m²",
    "30 - 50 m²",
    "50 - 80 m²",
    "80 - 100 m²",
    "100 - 150 m²",
    "Trên 150 m²",
];

export default function SearchBox() {
    const [activeTab, setActiveTab] = useState(38);
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [price, setPrice] = useState(priceRanges[0]);
    const [area, setArea] = useState(areas[0]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = { activeTab, location, category, price, area };
        console.log("Search params:", data);
        alert("Fake search: " + JSON.stringify(data, null, 2));
    };

    return (
        <section className="relative w-full max-w-6xl mx-auto mt-[-3rem] bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Tabs */}
            <ul className="flex border-b text-sm font-medium">
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 text-center cursor-pointer py-3 transition ${activeTab === tab.id
                                ? "text-red-600 border-b-2 border-red-600 font-semibold"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                    </li>
                ))}
            </ul>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
            >
                {/* Location */}
                <div className="col-span-5">
                    <input
                        type="text"
                        placeholder="Nhập tỉnh, quận hoặc khu vực..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                </div>

                {/* Category */}
                <Select value={category} onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 w-full focus:ring-red-500 focus:outline-none">
                        <SelectValue placeholder="Chọn loại nhà đất" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {categories.map((c) => (
                                <SelectItem value={c} key={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Price */}
                <Select value={price} onValueChange={(value) => setPrice(value)}>
                    <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none w-full">
                        <SelectValue placeholder="Chọn khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {priceRanges.map((p) => (
                                <SelectItem value={p} key={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Area */}
                <Select value={area} onValueChange={(value) => setArea(value)}>
                    <SelectTrigger className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none w-full">
                        <SelectValue placeholder="Chọn diện tích" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {areas.map((a) => (
                                <SelectItem value={a} key={a}>
                                    {a}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Search Button */}
                <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition"
                >
                    Tìm kiếm
                </button>
            </form>
        </section>
    );
}
