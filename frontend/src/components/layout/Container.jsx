import React from 'react'
import Layout from './Layout';
import {HomeBanner} from '../index';
import { useTheme } from '../../context/ThemeContext';
import { useParams } from 'react-router-dom';

function Container() {
    const { isDark } = useTheme();
    const { category } = useParams();  
    const activeCategory = category || "HOME";

    return (
        <div className={`w-full min-h-full ${isDark ? "bg-gray-900" : "bg-[#FFFFFF]"}`}>
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
