import { motion } from "framer-motion";

export default function TimelinePast({ timelineData, scrollContainerRef }) {
  return (
    <div className="w-full min-h-[50vh] flex justify-center py-10">
      <div className="flex gap-8 px-6" style={{ minWidth: `${timelineData.length * 360}px` }}>
        {timelineData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1.01 }}
            viewport={{ once: true, amount: 0.3, root: scrollContainerRef.current }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="relative min-w-[280px] md:min-w-[350px] h-[50vh] p-4 rounded-xl border border-transparent hover:border-pink-500 transition-all duration-300 shadow-lg flex-shrink-0"
            style={{
              height: "50vh",
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
            <div className="relative z-10 text-white">
              <h2 className="text-pink-400 text-3xl font-bold">{item.year}</h2>
              <h3 className="text-xl mt-1 font-semibold">{item.title}</h3>
              <p
                className="text-sm mt-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.desc }}
              ></p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


