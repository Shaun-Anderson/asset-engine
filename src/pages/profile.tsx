import { useEffect, useRef } from "react";
import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Badge } from "../components/design-system/Badge";
import { Accent } from "../utils/color";

function Profile() {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const { data } = useSession();
  console.log(data);

  const goToCheckout = async () => {
    // setIsCheckoutLoading(true);
    const res = await fetch(`/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { redirectUrl } = await res.json();
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    } else {
      // setIsCheckoutLoading(false);
      console.log("Error creating checkout session");
    }
  };

  return (
    <div className="">
      <div className="flex mt-5 mb-5">
        <div>
          <h1 className="text-2xl font-bold mt-5 text-white">Profile</h1>
          <h2 className=" text-xs text-gray-500 mt-2">
            Effect how you program is set up.
          </h2>
        </div>
      </div>
      <div className="flex gap-2 text-white">
        Subscription:{" "}
        {data?.user.isActive ? (
          <>
            <Badge accent={Accent.primary} text="Pro" />
            <button>Cancel</button>
          </>
        ) : (
          <>
            <Badge accent={Accent.default} text="Free" />
            <button onClick={() => goToCheckout()}>Upgrade</button>
          </>
        )}
      </div>
      <div className="flex gap-2 text-white">{data?.user?.id}</div>
    </div>
  );
}

export default Profile;
