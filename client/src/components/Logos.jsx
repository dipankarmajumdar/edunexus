import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <MdCastForEducation className="w-6 h-6 sm:w-7 sm:h-7" />,
    label: "20k+ Online Courses",
  },
  {
    icon: <SiOpenaccess className="w-6 h-6 sm:w-7 sm:h-7" />,
    label: "Lifetime Access",
  },
  {
    icon: <RiMoneyRupeeCircleFill className="w-6 h-6 sm:w-7 sm:h-7" />,
    label: "Value for Money",
  },
  {
    icon: <BiSupport className="w-6 h-6 sm:w-7 sm:h-7" />,
    label: "Lifetime Support",
  },
  {
    icon: <FaUsers className="w-6 h-6 sm:w-7 sm:h-7" />,
    label: "Community Support",
  },
];

const Logos = () => {
  return (
    <div className="w-full py-8 px-4 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
      {features.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-center gap-2 min-w-[250px] sm:min-w-[200px] px-4 py-3 rounded-full bg-gray-300 text-[#03394b] text-sm font-medium shadow-sm hover:shadow-md transition duration-200"
        >
          {item.icon}
          <span className="whitespace-nowrap">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Logos;
