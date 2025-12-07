import { motion } from "framer-motion";

export default function TimelinePast({ timelineData, scrollContainerRef }) {
  return (
    <div className="w-full flex justify-center py-10">
      <div
        className="
          flex
          gap-6
          px-4 sm:px-6
          overflow-x-auto
          snap-x snap-mandatory
        "
        style={{ scrollSnapType: "x mandatory" }}
      >
        {timelineData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{
              once: true,
              amount: 0.3,
              root: scrollContainerRef.current,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="
              relative
              flex-shrink-0
              snap-center
              rounded-xl shadow-lg overflow-hidden
              mx-auto
              border border-transparent hover:border-pink-500
              
              /* 手機平板：原本的卡片風格 */
              w-72 sm:hidden
              lg:hidden     /* 電腦時隱藏 */
            "
          >
            {/* 手機版圖片 */}
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-auto object-cover"
            />

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <h2 className="text-pink-400 text-2xl sm:text-3xl font-black">
                {item.year}
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl mt-1 font-semibold text-outline">
                {item.title}
              </h3>

              {/* 手機版正常多行 */}
              <p className="text-sm sm:text-lg md:text-xl mt-2 leading-relaxed break-words text-outline">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}

        {/* ============================= */}
        {/* 🖥️ 電腦版（≥ lg）：新版卡片樣式 */}
        {/* ============================= */}

        {timelineData.map((item, index) => (
          <motion.div
            key={"desktop-" + index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1.01 }}
            viewport={{
              once: true,
              amount: 0.3,
              root: scrollContainerRef.current,
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="
              hidden sm:block   /* 只有電腦版出現 */
              relative
              min-w-[350px]
              h-[50vh]
              p-4
              rounded-xl
              border border-transparent hover:border-pink-500
              transition-all duration-300
              shadow-lg
              flex-shrink-0
              snap-center
            "
            style={{
              height: "50vh",
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-xl"></div>

            <div className="relative z-10 text-white">
              <h2 className="text-pink-400 text-3xl font-black">
                {item.year}
              </h2>

              <h3 className="text-2xl md:text-4xl lg:text-5xl mt-2 sm:mt-5 lg:mt-3 font-semibold text-outline"> 
                {item.title}
              </h3>

              {/* 電腦版：多行也不會撐大卡片 */}
              <p
                className="text-lg md:text-3xl lg:text-2xl mt-3 leading-relaxed text-outline md:mt-10 lg:mt-5"
                dangerouslySetInnerHTML={{ __html: item.desc }}
              />
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
