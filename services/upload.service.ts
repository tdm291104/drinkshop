export async function uploadImageToCloudinary(
    file: File,
    folder: string
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload ảnh thất bại");
    }

    return data.data.secure_url as string;
}
