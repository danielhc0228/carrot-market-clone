"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
    isLiked: boolean;
    likeCount: number;
    postId: number;
}

export default function LikeButton({ isLiked, likeCount, postId }: LikeButtonProps) {
    /**
     * const [state, reducerFn] = useOptimistic(initialState, reducerFunction)
     * state is your current optimistic UI state.
     * reducerFn(payload) is how you update the optimistic state.
     * reducerFunction(previousState, payload) is a custom function that tells
     * React how to compute the next state from the current one.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, reducerFn] = useOptimistic({ isLiked, likeCount }, (previousState, payload) => ({
        isLiked: !previousState.isLiked,
        likeCount: previousState.isLiked
            ? previousState.likeCount - 1
            : previousState.likeCount + 1,
    }));
    const onClick = async () => {
        reducerFn(undefined);
        if (isLiked) {
            await dislikePost(postId);
        } else {
            await likePost(postId);
        }
    };
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors ${
                state.isLiked
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "hover:bg-neutral-800"
            }`}
        >
            {state.isLiked ? (
                <HandThumbUpIcon className="size-5" />
            ) : (
                <OutlineHandThumbUpIcon className="size-5" />
            )}
            {state.isLiked ? (
                <span> {state.likeCount}</span>
            ) : (
                <span>Like ({state.likeCount})</span>
            )}
        </button>
    );
}
