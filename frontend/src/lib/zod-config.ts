import z from "zod";

z.config({
    customError: (issue) => {
        switch (issue.code) {
            case "invalid_type":
                if (issue.expected && (issue as any).input == null) {
                    return "Trường này bắt buộc nhập";
                }
                return `Kiểu dữ liệu không hợp lệ (cần ${issue.expected})`;

            case "too_small":
                if (issue.origin === "string") {
                    if (issue.minimum === 1) {
                        return "Trường này không được để trống";
                    }
                    return `Tối thiểu ${issue.minimum} ký tự`;
                }
                return `Giá trị quá nhỏ (>= ${issue.minimum})`;

            case "too_big":
                if (issue.origin === "string") {
                    return `Tối đa ${issue.maximum} ký tự`;
                }
                return `Giá trị quá lớn (<= ${issue.maximum})`;

            case "invalid_format":
                if (issue.format === "email") {
                    return "Email không hợp lệ";
                }
                return "Định dạng không hợp lệ";

            case "invalid_value":
                return "Giá trị không hợp lệ";

            case "invalid_union":
                return "Không phù hợp với bất kỳ schema hợp lệ nào";

            case "unrecognized_keys":
                return `Không được chứa các field: ${issue.keys.join(", ")}`;

            case "invalid_key":
                return "Key không hợp lệ";

            case "invalid_element":
                return "Phần tử không hợp lệ";

            case "not_multiple_of":
                return `Phải chia hết cho ${issue.divisor}`;

            case "custom":
                return issue.message ?? "Giá trị không hợp lệ";

            default:
                return "Giá trị không hợp lệ";
        }
    },
});

export { z };
