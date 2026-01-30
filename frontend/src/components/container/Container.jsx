import React from 'react'
import Layout from '../categories/Layout';
import HomeBanner from '../categories/HomeBanner';
import { useTheme } from '../../context/ThemeContext';
import { useOutletContext } from 'react-router-dom';

function Container() {
    const {isDark} = useTheme();

    const { activeTab } = useOutletContext();

    return (
        
        <div className={`w-full min-h-screen pt-2 ${isDark? "darkBgImg" : "bgImg"}`}>
            <div>
                {/* Home Banner */}
                {activeTab === "HOME" && <HomeBanner />}
                {/* Category */}
                {<Layout category={activeTab} />}

            </div>
        </div>
    )
}

export default Container