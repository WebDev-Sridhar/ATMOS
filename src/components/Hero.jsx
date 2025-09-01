const Hero = () => {
  return (
    <section className="relative w-full h-[40vh] flex items-center justify-center  text-white overflow-hidden">


      {/* Title */}
   <h1
  className="relative text-6xl md:text-8xl font-extrabold tracking-widest drop-shadow-lg"
  style={{ fontFamily: '"Kode Mono", monospace' }}
>
  ATMOS
</h1>

      {/* Tagline */}
      <p className="absolute bottom-14 text-gray-300 text-lg md:text-xl tracking-wide animate-fadeIn">
        Your Futuristic Weather Companion
      </p>
    </section>
  );
};

export default Hero;
