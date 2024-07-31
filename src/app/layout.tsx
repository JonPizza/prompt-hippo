import React from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';


const Layout: React.FC = ({ children } ) => {
    return (
        <>
            {children}
            <GoogleAnalytics gaId="G-RCYZEBH4YD" />
        </>
    );
};

export default Layout;