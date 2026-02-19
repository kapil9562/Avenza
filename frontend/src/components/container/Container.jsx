import React from 'react'
import Layout from '../categories/Layout';
import HomeBanner from '../categories/HomeBanner';
import { useTheme } from '../../context/ThemeContext';
import { useParams } from 'react-router-dom';

function Container() {
    const { isDark } = useTheme();
    const { category } = useParams();  
    const activeCategory = category || "HOME";

    return (
        <div className={`w-full min-h-[80dvh] pt-2 ${isDark ? "darkBgImg" : "bgImg"}`}>
            <div>
                {/* Home Banner */}
                {activeCategory === "HOME" && <HomeBanner />}

                {/* Category Layout */}
                <Layout category={activeCategory} />
            </div>
        </div>
    )
}

export default Container;
