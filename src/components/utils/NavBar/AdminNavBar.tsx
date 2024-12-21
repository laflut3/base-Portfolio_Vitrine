"use client"

import React from 'react'
import Image from 'next/image'
import navIcon from '@/../public/images/logo/fleo-web-reversed.png';
import {useSession} from "next-auth/react";
import {FaUserCircle} from "react-icons/fa";
import MenuBurger from "@/components/utils/NavBar/MenuBurger";
import {useRouter} from "next/navigation";

export default function AdminNavbar() {
    const {data: session, status} = useSession();

    return (
        <header className="flex flex-row justify-between transition-all duration-300 font-thin text-xl letter-spacing fixed top-0 left-0 right-0 z-50 pt-0 pb-0 hover:bg-black hover:bg-opacity-50 hover:backdrop-blur-md">
            <div className={`flex items-center justify-center space-x-2 p-4`}>
                <Image src={navIcon} alt="logo" width={60} height={60} style={{height: "auto"}}/>
                <p className={`font-lazy-dog hidden sm:flex`}>Mona-venture ADMINISTRATION</p>
                <p className={`font-lazy-dog sm:hidden`}>ADMINISTRATION</p>
            </div>
            <div className={`flex items-center justify-center space-x-4 p-4`}>
                 <a href={`/profile`}>
                    <FaUserCircle className={`cursor-pointer text-gray-700 w-12 h-12`}/>
                 </a>
                <MenuBurger/>
            </div>
        </header>

    )
}
