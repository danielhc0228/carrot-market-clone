"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CloseButton() {
    const router = useRouter();
    const onCloseClick = () => {
        router.back();
    };
    return (
        <button onClick={onCloseClick} className="absolute top-5 right-5 text-neutral-200">
            <XMarkIcon className="size-10" />
        </button>
    );
}
