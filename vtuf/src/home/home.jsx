import React from "react";
import HeroSection from "./hero";
import FAq from "./faq";
import Security from "./security";
import HowItWorks from "./howItWorks";
import Footer from "./footer";
import GetStarted from "./geStarted";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />

      <Security />
      <FAq />
      <GetStarted/>
      <Footer/>
    </div>
  );
}
