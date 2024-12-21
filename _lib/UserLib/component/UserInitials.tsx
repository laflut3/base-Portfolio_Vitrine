import React from 'react';

interface UserInitialsProps {
    firstName: string;
    lastName: string;
}

const UserInitials: React.FC<UserInitialsProps> = ({ firstName, lastName }) => {
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

    return (
        <div className="flex items-center justify-center bg-blue-500 text-white font-bold rounded-full" style={{ width: '44px', height: '44px' }}>
            {initials}
        </div>
    );
};

export default UserInitials;
