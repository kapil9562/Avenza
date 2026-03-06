import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(x => x);

  const formatName = (str) =>
    str.split("-").map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");


  return (
    <div className="flex text-[#878787] text-sm font-medium">
      <Link to="/">Home</Link>

      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");

        return (
          <span key={index} className="flex flex-row items-center">
            <MdKeyboardArrowRight size={20} />
            <Link to={routeTo}>{formatName(name)}</Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;