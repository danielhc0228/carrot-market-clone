"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
    initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    const trigger = useRef<HTMLSpanElement>(null); // connects span element
    const productsRef = useRef(products);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                const element = entries[0];
                if (element.isIntersecting && trigger.current) {
                    // if span element can be seen, stop observe and load more products.
                    observer.unobserve(trigger.current);
                    setIsLoading(true);
                    const newProducts = await getMoreProducts(page + 1);
                    if (newProducts.length !== 0) {
                        const uniqueNewProducts = newProducts
                            .map((p) => ({
                                ...p,
                                created_at:
                                    typeof p.created_at === "string"
                                        ? p.created_at
                                        : p.created_at.toISOString(),
                            }))
                            .filter(
                                (newItem) =>
                                    !productsRef.current.some(
                                        (existing) => existing.id === newItem.id,
                                    ),
                            );

                        setPage((prev) => prev + 1);
                        setProducts((prev) => [...prev, ...uniqueNewProducts]);
                    } else {
                        setIsLastPage(true);
                    }

                    setIsLoading(false);
                }
            },
            {
                threshold: 1.0,
            },
        );
        if (trigger.current) {
            observer.observe(trigger.current);
        }
        return () => {
            // clean up function
            observer.disconnect();
        };
    }, [page]); //observing begins everytime page value is changed, this allows infinite scrolling

    useEffect(() => {
        setProducts(initialProducts);
        setPage(0);
        setIsLastPage(false);
    }, [initialProducts]);

    return (
        <div className="flex flex-col gap-5 p-5">
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
            {!isLastPage ? (
                <span
                    ref={trigger}
                    style={{
                        marginTop: `${page + 1 * 50}vh`, //test purpose since there aren't many products
                    }}
                    className="mx-auto mb-15 w-fit rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold hover:opacity-90 active:scale-95"
                >
                    {isLoading ? "Loading" : "Load more"}
                </span>
            ) : (
                <div className="mb-15" />
            )}
        </div>
    );
}
