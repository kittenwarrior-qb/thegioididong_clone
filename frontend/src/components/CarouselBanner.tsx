import { Carousel } from "antd";
import Banner1 from "../assets/tgdd/banner1.png";
import Banner2 from "../assets/tgdd/banner2.png";
import Banner3 from "../assets/tgdd/banner3.png";
import Banner4 from "../assets/tgdd/banner4.png";
import Banner5 from "../assets/tgdd/banner5.png";

const images = [Banner1, Banner2, Banner3, Banner4, Banner5,Banner1, Banner2, Banner3, Banner4, Banner5];

const chunkArray = (arr: string[], size: number) => {
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const CarouselBanner = () => {
  const slides = chunkArray(images, 2);

  return (
    <div className="max-w-[1200px] mx-auto my-4 rounded-lg overflow-hidden">
      <Carousel autoplay dots draggable infinite arrows>
        {slides.map((group, idx) => (
          <div key={idx} className="w-full">
            <div className="flex gap-4 w-full">
              {group.map((img, j) => (
                <img
                  key={j}
                  src={img}
                  alt={`banner-${idx}-${j}`}
                  className={`w-1/2 h-[200px] md:h-[200px] object-cover 
                    ${j === 0 ? "rounded-l-lg" : ""} 
                    ${j === group.length - 1 ? "rounded-r-lg" : ""}`}
                />
              ))}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
