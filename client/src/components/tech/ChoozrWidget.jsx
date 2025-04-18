// client/src/components/ChoozrWidget.js
import React, { useEffect, useRef } from "react";

const ChoozrWidget = ({ storeId, sku }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    const scriptId = "choozr-widget-script";

    // Function to initialize the widget after the script loads
    const initializeWidget = () => {
      if (window.Choozr && widgetRef.current) {
        window.choozr = new window.Choozr({
          storeId: storeId, // Replace with your store ID
          product: { sku: sku }, // Replace with the product SKU
          target: widgetRef.current, // DOM element where widget will be injected
        });
      }
    };

    // Check if the script is already added
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://widget.choozr.ai/6.x.x/choozr.js";
      script.id = scriptId;
      script.async = true;
      script.onload = initializeWidget;
      document.body.appendChild(script);
    } else {
      // If the script is already loaded, initialize the widget immediately
      initializeWidget();
    }
  }, [storeId, sku]);

  return <div ref={widgetRef} />;
};

export default ChoozrWidget;
