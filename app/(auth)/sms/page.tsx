"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { smsLogIn } from "./actions";
import { useActionState } from "react";

const initialState = {
    token: false,
    error: undefined,
};

export default function SMSLogin() {
    const [state, dispatch] = useActionState(smsLogIn, initialState);
    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">SMS Log in</h1>
                <h2 className="text-xl">Verify your phone number.</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                {state.token ? ( //if phone number is valid then show input for verfication code
                    <Input
                        name="token"
                        type="number"
                        placeholder="Verification code"
                        required
                        min={100000}
                        max={999999}
                    />
                ) : (
                    // else stay with phone number input
                    <Input
                        name="phone"
                        type="text"
                        placeholder="Phone number"
                        required
                        errors={state.error?.formErrors}
                    />
                )}
                <Button text={state.token ? "Verify Token" : "Send Verification SMS"} />
            </form>
        </div>
    );
}
