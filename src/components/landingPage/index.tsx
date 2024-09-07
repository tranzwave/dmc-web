"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LandingPage = () => {
    const pathname = usePathname()
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-[#111729]">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 bg-[#287F71] text-white flex justify-between items-center">
        <div className="text-xl font-bold">Tranzwave</div>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:text-[#EB862A]">Home</a></li>
          <li><a href="#" className="hover:text-[#EB862A]">About</a></li>
          <li><a href="#" className="hover:text-[#EB862A]">Services</a></li>
          <li><a href="#" className="hover:text-[#EB862A]">Contact</a></li>
        </ul>
        <Link href={`/dashboard/overview`}>
            <button className="py-2 px-5 bg-[#EB862A] text-white rounded hover:bg-[#b96a1f] transition duration-300">Sign In</button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-5 bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?adventure')" }}>
        <h1 className="text-6xl font-extrabold text-neutral-800 mb-4 drop-shadow-md">Discover Your Next Adventure</h1>
        <p className="text-xl mb-8 max-w-md text-neutral-800">
          Join us and explore the most exciting places around the world with ease and comfort.
        </p>
        <button className="py-3 px-8 bg-primary-green text-white rounded-lg text-lg font-semibold hover:bg-[#1b554b] transition duration-300">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-slate-300 text-center">
        <h2 className="text-4xl font-bold mb-8">Why Choose Tranzwave?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 w-72">
            <h3 className="text-2xl font-semibold mb-4">Flexible Plans</h3>
            <p>We offer customizable plans that fit all your travel needs.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 w-72">
            <h3 className="text-2xl font-semibold mb-4">Experienced Guides</h3>
            <p>Our guides are experienced, friendly, and multilingual.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 w-72">
            <h3 className="text-2xl font-semibold mb-4">24/7 Support</h3>
            <p>Always available to assist you with any questions or concerns.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-4xl font-bold mb-8 text-[#287F71]">What Our Clients Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-[#ABBDD3] rounded-lg shadow-md p-6 w-80">
            <p className="text-lg italic">"Tranzwave made my travel planning a breeze! Highly recommended."</p>
            <p className="text-sm font-bold mt-4">- Sarah L.</p>
          </div>
          <div className="bg-[#ABBDD3] rounded-lg shadow-md p-6 w-80">
            <p className="text-lg italic">"Amazing experience with the best guides and services!"</p>
            <p className="text-sm font-bold mt-4">- John D.</p>
          </div>
          <div className="bg-[#ABBDD3] rounded-lg shadow-md p-6 w-80">
            <p className="text-lg italic">"Great customer support and flexible options for everyone."</p>
            <p className="text-sm font-bold mt-4">- Emily R.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full py-4 bg-[#111729] text-white text-center">
        <p className="text-sm">© 2024 Tranzwave. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
