import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { IoIosSearch } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom"
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';
import { PiShoppingCartFill } from "react-icons/pi";
import { IoHeartSharp } from "react-icons/io5";
import { useTheme } from '../../context/ThemeContext';
import { getAllCategory, getProducts } from '../../api/api';
import { IoIosArrowUp } from "react-icons/io";
import userLight from '../../assets/userLight.png';
import userDark from '../../assets/user.png';
import { BsMoonStarsFill } from "react-icons/bs";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { useProducts } from '../../context/ProductsContext';

function Header({ activeTab, setActiveTab, setShow }) {

  const { isDark, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const authBtnClass =
    "bg-[#FF6F61] border-[#ff3e2d] border-2 rounded-4xl p-2 hover:bg-[#ff3e2d] transition-transform duration-150 ease-out active:scale-95 transform-gpu cursor-pointer flex justify-center items-center";

  const [input, setInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const suggestions = useMemo(() => filteredData.slice(0, 5), [filteredData]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [alert, setAlert] = useState(false);
  const [searchType, setSearchType] = useState("");
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const { totalItems } = useCart();
  const [openIndex, setOpenIndex] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (location.pathname !== "/search") {
      setInput("");
      setSearchType("");
    }
  }, [location.pathname]);

  const handleDropDown = () => {
    if (isActive) setIsActive(false);
    else setIsActive(true);
  };

  const searchProduct = async (input) => {
    try {
      const response = await getProducts({ limit: 0, title: input });
      const data = response.data.products;
      setFilteredData(data);
      if (searchType != 'autosuggest') {
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Error fetching Search:", error);
    }
  }

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!input.trim()) {
      setShowDropdown(false);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      searchProduct(input);
    }, 400);

    return () => clearTimeout(searchTimeout.current);
  }, [input]);

  const { setSearchResults } = useSearch();

  const searchHandler = useCallback(() => {
    const query = input?.trim();
    if (!query || !filteredData?.length) return;

    navigate(
      `/search?q=${encodeURIComponent(query)}&searchType=${searchType}&searchIdentifier=text_search`
    );

    setSearchResults(filteredData);
    setShowDropdown(false);
    setActiveTab(null);
  }, [input, filteredData, searchType]);

  const handleEnter = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    setSearchType("manual");
    searchHandler();
  };

  const normalizeGooglePhoto = (url) => {
    if (!url) return null;
    return url.split('=')[0] + '=s200';
  };

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopSearchRef.current?.contains(e.target) ||
        mobileSearchRef.current?.contains(e.target) ||
        categoryRef.current?.contains(e.target)
      ) return;

      setShowDropdown(false);
      setOpenIndex(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleTabClick = (tab) => {
    navigate('/')
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  const { categories, setCategories } = useProducts();

  useEffect(() => {
    if (categories.length) return;

    const fetchCategories = async () => {
      const res = await getAllCategory();
      setCategories(res.data);
    };

    fetchCategories();
  }, []);


  return (
    <div className={`w-full border-b-2 sticky top-0 z-50 min-h-20 flex flex-col will-change-transform ${isDark ? "bg-[#0F172A] border-b-gray-800" : "bg-[#ffffff]"} border-b-gray-200`}>

      <div className='flex flex-row justify-between w-full min-h-15 sm:min-h-20 gap-4 px-1 sm:px-5 lg:px-10'>

        <div className='flex flex-row justify-center items-center gap-3'>
          {/* categories taggle btn */}
          <div className='xl:hidden' onClick={() => setShow(true)}>
            <HiMiniBars3BottomLeft size={28} className={`${isDark ? "text-gray-300" : "text-gray-700"} cursor-pointer`} />
          </div>

          {/* LOGO */}
          <div className='cursor-pointer flex justify-center items-center' onClick={() => {
            setActiveTab("HOME");
            navigate('/')
          }}>
            <img src={logo} alt="logo" className='sm:w-40 w-30 object-cover' />
          </div>
        </div>

        {/* SEARCH */}
        <div className='relative w-1/2 sm:flex flex-row justify-center items-center hidden ' ref={desktopSearchRef}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSearchType(null);
            }}
            onKeyDown={handleEnter}
            type="text"
            placeholder='Search products, brands, categories…'
            className={`z-10 w-full p-2 pl-10 rounded-4xl border-2 border-gray-300 font-semibold text-gray-700 ${isDark ? "focus:border-white focus:outline-none bg-[#0F172A] placeholder:text-gray-500 text-white" : "focus:border-[#6B6F9C] focus:outline-none bg-white placeholder:text-gray-500"}`} />
          <IoIosSearch className='absolute left-3 text-2xl font-semibold text-[#8b90c7] z-20' />
          {showDropdown && <div className={`${isDark ? "bg-[#0F172A] text-gray-400" : "bg-[#FFEDF3]"} absolute top-10 left-0 w-full rounded-xl border-2 border-gray-300 pt-4 max-h-60 overflow-hidden z-5`} >
            <div className={`${showDropdown ? "block" : "hidden"} w-full max-h-50 overflow-auto pt-1`}>
              {suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      const title = product.title;
                      setInput(title);
                      setSearchType("autosuggest");

                      navigate(
                        `/search?q=${encodeURIComponent(title)}&searchType=autosuggest&searchIdentifier=text_search`
                      );

                      setSearchResults(filteredData);
                      setShowDropdown(false);
                      setActiveTab(null);
                    }}
                    className={`${isDark ? "hover:bg-[#262e41]" : "hover:bg-[#fcdce7]"} py-1 px-2 font-semibold flex flex-row gap-2 border-b-2 border-[#f7ddf4] cursor-pointer`}
                  >
                    <IoIosSearch className="text-2xl text-gray-500" />
                    <p>{product.title}</p>
                  </div>
                ))
              ) : (
                <div className="py-1 px-2 font-semibold flex gap-2 text-gray-500">
                  <IoIosSearch className="text-2xl" />
                  <p>No result found</p>
                </div>
              )}

            </div>
          </div>
          }
        </div>

        {/* OTHERS */}
        <div className='flex justify-center items-center text-2xl gap-2 md:gap-5 relative'>

          {/* Theme Changer Button */}
          <div className='flex justify-center items-center text-[16px]'>

            {/* Toggle for mobiles */}
            <button onClick={toggleTheme} className='flex justify-center items-center sm:hidden cursor-pointer'>
              {isDark ? <img src="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/2600.svg" alt="" className='min-h-6 min-w-6' /> : <BsMoonStarsFill className='text-yellow-500 text-xl' />}
            </button>

            {/* Toggle for destop */}
            <button
              onClick={toggleTheme}
              className={`relative w-18 h-8 rounded-full hidden items-center transition-all duration-500 cursor-pointer ${isDark ? "bg-[#2d323a] shadow-black" : "bg-[#e9ecef] shadow-gray-400"} shadow-inner sm:flex`}
            >
              {/* Knob */}
              <span className={`absolute w-6 h-6 z-10 rounded-full shadow-md flex items-center justify-center transition-all duration-500 ${isDark ? "translate-x-11 bg-[#15171b] shadow-black" : "translate-x-1 bg-white"}`}
              >
                {isDark ? (<BsMoonStarsFill className='text-yellow-500' />) : (<img src="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/2600.svg" alt="" className='h-5 w-5' />)}
              </span>
              {isDark ? (<span className='absolute left-1 text-gray-500 font-semibold'>Light</span>) : (<span className='absolute right-1'>Dark</span>)}
            </button>
          </div>
          <div className={`${isDark ? "text-gray-200" : "text-gray-700"} flex flex-col justify-center items-center text-sm md:text-lg hover:text-[#FF6F61] cursor-pointer`} onClick={() => navigate('/whitelist')}>
            <IoHeartSharp className='text-3xl text-red-600' />
            <span className="hidden sm:flex font-['Sour_Gummy'] font-medium">Favorite</span>
          </div>
          <div onClick={() => {
            setActiveTab('');
            navigate('/carts');
          }} className={`${isDark ? "text-gray-200" : "text-gray-700"} flex flex-col justify-center items-center text-sm md:text-lg hover:text-[#FF6F61] cursor-pointer`}>
            <div className='relative'>
              <PiShoppingCartFill className='text-3xl text-[#FF6F61]' />
              {totalItems > 0 && (
                <span className='absolute md:bottom-3 sm:bottom-2 text-white flex justify-center items-center bg-red-500 rounded-full left-1/2 bottom-4 z-100 h-6 w-6 border border-white text-sm'>{(totalItems) < 10 ? totalItems : "9+"}
                </span>
              )}
            </div>
            <span className="hidden sm:flex font-['Sour_Gummy']">Cart</span>
          </div>
          {user ? (
            <div className="relative group min-h-full flex cursor-pointer"
              onClick={() => handleDropDown()}>
              <div className='group-hover:shadow-[inset_0_-2px_0_0_#ff1774] min-h-full flex justify-center items-center p-2'>
                {(user?.photo) ? (
                  <img
                    src={normalizeGooglePhoto(user?.photo)}
                    alt="pfp"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className='md:max-h-12 md:max-w-12 max-h-10 max-w-10 rounded-full object-cover' />
                ) : (
                  <div className={`flex flex-col justify-center items-center text-sm md:text-lg group-hover:text-pink-500 relative group cursor-pointer ${isDark ? "text-gray-300" : "text-[#373951]"}`}>
                    <img src={`${isDark ? userDark : userLight}`} alt="pfp" className='h-8 w-8 rounded-full' />
                    <span className="font-['Sour_Gummy'] hidden sm:block">Profile</span>
                  </div>
                )}
                <div className={`${isActive ? "opacity-100" : "opacity-0 invisible"} ${isDark ? "bg-[#0F172A] shadow-[#0F172A] shadow-lg border-gray-700" : "bg-white shadow-gray-300 border-gray-200 shadow-xl"} absolute top-full flex flex-col justify-center text-lg font-semibold border-2 group-hover:opacity-100 group-hover:visible rounded-lg overflow-hidden z-90 right-0`}>
                  <button className={`${isDark ? "text-gray-400 hover:bg-[#2e3d5f]" : "hover:bg-pink-100  text-black"} flex flex-row items-center whitespace-nowrap gap-2 px-4 py-2 cursor-pointer`}>
                    <LiaShoppingBagSolid className='text-xl' />
                    <span>My Orders</span>
                  </button>
                  <div className={`${isDark ? "border-gray-700" : "border-gray-300"} w-full border-t-2`}></div>
                  <button
                    className={`${isDark ? "hover:bg-[#2e3d5f]" : "hover:bg-pink-100"} flex flex-row items-center whitespace-nowrap gap-2 text-red-500 px-4 py-2 cursor-pointer`}
                    onClick={() => setAlert(true)}>
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
                {alert && (
                  <div className={`${isDark ? "bg-[#0F172A] shadow-[#0F172A] shadow-lg border-gray-700" : "bg-white shadow-xl shadow-gray-300 border-gray-200"} absolute right-0 top-full flex flex-col justify-center text-lg font-semibold border-2 rounded-lg overflow-hidden py-3 px-4 gap-2 z-100 cursor-default`}>
                    <div className={`${isDark ? "text-gray-400" : "text-black"} whitespace-nowrap`}>Sure to logout ?</div>
                    <div className='w-full flex flex-row justify-between'>
                      <button className=' bg-[#dadada] text-black font-semibold text-lg py-1 px-4 rounded-xl active:scale-90 transition-all cursor-pointer' onClick={() => setAlert(false)}>No</button>
                      <button className='bg-[#FF6F61] text-white font-semibold text-lg py-1 px-4 rounded-xl active:scale-90 transition-all cursor-pointer' onClick={() => logout()}>yes</button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <>
              <div className='lg:flex text-[18px] tracking-wider font-[Sour_Gummy] font-semibold text-white gap-2 hidden justify-center items-center whitespace-nowrap'>
                <NavLink to="/signup" className={authBtnClass}>Sign up</NavLink>
                <NavLink to="/login" className={authBtnClass}>Log in</NavLink>
              </div>
              <div className='whitespace-nowrap flex text-[14px] sm:text-[18px] font-semibold text-white gap-2 justify-center lg:hidden items-center'>
                <NavLink to="/login" className={authBtnClass}>Sign in</NavLink>
              </div>
            </>
          )}
        </div>

      </div>

      <div className='relative w-full flex flex-row justify-center items-center sm:hidden mb-1' ref={mobileSearchRef}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSearchType(null);
          }}
          onKeyDown={handleEnter}
          type="text"
          placeholder='Enter your product name...'
          className={`z-10 w-full p-2 pl-10 rounded-4xl border-2 border-gray-300 font-semibold text-gray-700 ${isDark ? "focus:border-white focus:outline-none bg-[#0F172A] placeholder:text-gray-500 text-white" : "focus:border-[#6B6F9C] focus:outline-none bg-white placeholder:text-gray-500"}`} />
        <IoIosSearch className='absolute left-3 text-2xl font-semibold text-gray-500 z-20' />
        {showDropdown && <div className={`${isDark ? "bg-[#0F172A] text-gray-400" : "bg-[#FFEDF3]"} absolute top-5 left-0 w-full rounded-xl border-2 border-gray-300 pt-4 max-h-60 overflow-hidden z-5`}>
          <div className={`${showDropdown ? "block" : "hidden"} w-full max-h-50 overflow-auto pt-1`}>
            {suggestions.length > 0 ? (
              suggestions.map((product) => (
                <div
                  onClick={() => {
                    const title = product.title;
                    setInput(title);
                    setSearchType("autosuggest");

                    navigate(
                      `/search?q=${encodeURIComponent(title)}&searchType=autosuggest&searchIdentifier=text_search`
                    );

                    setSearchResults(filteredData);
                    setShowDropdown(false);
                    setActiveTab(null);
                  }}
                  key={product.id}
                  className={`${isDark ? "hover:bg-[#262e41]" : "hover:bg-[#fcdce7]"} py-1 px-2 font-semibold flex flex-row gap-2 border-b-2 border-[#f7ddf4] cursor-pointer`}
                >
                  <IoIosSearch className="text-2xl text-gray-500" />
                  <p>{product.title}</p>
                </div>
              ))
            ) : (
              <div className="py-1 px-2 font-semibold flex gap-2 text-gray-500 backdrop:hidden">
                <IoIosSearch className="text-2xl" />
                <p>No result found</p>
              </div>
            )}

          </div>
        </div>
        }
      </div>

      {/* categories dropdown for large screen */}
      <div className={`xl:flex hidden flex-row border-t-2  px-1 sm:px-5 lg:px-10 relative ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <div className='no-scrollbar overflow-x-auto flex flex-row gap-2 font-[Roboto_Serif] tracking-tight'>

          <div className={`flex justify-center items-center cursor-pointer py-1 gap-4 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-[#FF6F61] after:scale-x-0 after:origin-left group after:transition-transform will-change-transform after:duration-300 hover:after:scale-x-100 ${isDark ? "text-gray-200" : "text-gray-700"} ${activeTab === "HOME" ? "pointer-events-none" : "pointer-events-auto"}`} onClick={() => handleTabClick("HOME")}>
            <span className={`${activeTab === "HOME" ? "border-[#FF6F61] bg-[#FF6F6120]" : "border-transparent"} px-2 w-full py-1 rounded-xl border group-hover:text-[#FF6F61] ${isDark ? "text-gray-200" : "text-gray-700"}`}>HOME</span>
          </div>

          {categories.map((item, idx) => {
            const isParentActive = item.categories.includes(activeTab);
            return (
              <div className='group flex flex-row gap-1' key={idx}>
                <div className='h-full flex justify-center items-center' >
                  <div className={`bg-gray-700 h-6 border-r-2 ${isDark ? "border-r-gray-800 " : "border-r-gray-200"}`}></div>
                </div>
                <div className="flex flex-row gap-2 rounded-xl" >
                  <div className='flex flex-row gap-4 h-full relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-[#FF6F61] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100 py-2 px-2 will-change-transform'>
                    <div className={`cursor-pointer flex justify-center items-center whitespace-nowrap group-hover:text-[#FF6F61] gap-1 ${isParentActive ? "text-[#FF6F61]" : isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      <span className='tracking-tight'>{item.parentCategory}</span>
                      <IoIosArrowUp className={`group-hover:rotate-180 text-sm transition-all duration-300 ${isDark ? "text-gray-200" : "text-gray-800"}`} />
                    </div>
                  </div>
                </div>
                {item.categories.length > 0 &&
                  (<div className={`${isDark ? " border-gray-800 bg-[#0F172A]" : "bg-white border-gray-200"} border-2 absolute w-full top-full left-0 flex flex-col opacity-0 transition-all duration-300 group-hover:opacity-100 invisible group-hover:visible py-2 ${openIndex === idx ? "opacity-100 visible" : "opacity-0 invisible"}`} ref={categoryRef}>
                    <div className={`w-full px-1 sm:px-5 md:px-10`}>
                      {item.categories.map((sub, i) => (
                        <div key={i} className={`cursor-pointer hover:text-[#FF6F61] px-4 whitespace-nowrap capitalize  py-1  $ ${activeTab === sub ? "text-[#FF6F61]" : isDark ? "text-gray-200" : "text-gray-700"}`}
                          onClick={() => { handleTabClick(sub) }}>
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>)
                }
              </div>
            )
          }
          )}

        </div>
      </div>
    </div>
  )
}

export default Header;