import React from "react";
import Link from "next/link";
import {AiOutlineRight} from "react-icons/ai";

const UserSection: React.FC = () => {
    return (
        <div className=" mb-4 flex text-6xl stroke-2 stroke-black">
            <Link href="/admin" className="hover:text-blue-500 flex items-center">
                <AiOutlineRight className="rotate-180" color={`black`}/>
                <span className={"mr-5"}>Section utilisateur</span>
            </Link>
        </div>
    )
}

export default UserSection
